import ai from "../config/gemini.js";
import { ApiError } from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Gemini Helper
|--------------------------------------------------------------------------
*/

const askGemini = async (prompt) => {
  try {
    console.log("========== GEMINI REQUEST STARTED ==========");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
      },
    });

    console.log("========== GEMINI RESPONSE RECEIVED ==========");

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Empty AI response");
    }

    /*
     * Sometimes AI may accidentally return extra text.
     * Try direct JSON first.
     */
    try {
      const result = JSON.parse(text);
      console.log("========== AI JSON PARSED ==========");
      return result;
    } catch (error) {
      /*
       * Try extracting the JSON object.
       */
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("Invalid JSON returned by AI");
      }

      const jsonText = text.slice(start, end + 1);

      return JSON.parse(jsonText);
    }
  } catch (error) {
    console.error("INTERVIEW AI ERROR:", error);

    throw new ApiError(
      500,
      "Interview question generation failed"
    );
  }
};

/*
|--------------------------------------------------------------------------
| Question Distribution
|--------------------------------------------------------------------------
*/

const getQuestionDistribution = (questionCount) => {
  switch (questionCount) {
    case 5:
      return {
        coding: 1,
        oral: 4,
      };

    case 10:
      return {
        coding: 2,
        oral: 8,
      };

    case 15:
      return {
        coding: 3,
        oral: 12,
      };

    default:
      throw new ApiError(
        400,
        "Question count must be 5, 10 or 15"
      );
  }
};

/*
|--------------------------------------------------------------------------
| Validate AI Questions
|--------------------------------------------------------------------------
*/

const validateQuestions = (
  questions,
  questionCount,
  distribution
) => {
  if (!Array.isArray(questions)) {
    console.log("AI questions is not an array");

    return false;
  }

  /*
   * Check total number
   */
  if (questions.length !== questionCount) {
    console.log(
      `Expected ${questionCount} questions but received ${questions.length}`
    );

    return false;
  }

  let codingCount = 0;
  let oralCount = 0;

  for (const item of questions) {
    /*
     * Question must exist
     */
    if (
      !item ||
      typeof item.question !== "string" ||
      !item.question.trim()
    ) {
      console.log("Invalid question:", item);

      return false;
    }

    /*
     * Category must be coding/oral
     */
    if (
      item.category !== "coding" &&
      item.category !== "oral"
    ) {
      console.log(
        "Invalid question category:",
        item.category
      );

      return false;
    }

    /*
     * Expected answer
     */
    if (
      typeof item.expectedAnswer !== "string"
    ) {
      return false;
    }

    if (item.category === "coding") {
      codingCount++;
    }

    if (item.category === "oral") {
      oralCount++;
    }
  }

  /*
   * Validate coding count
   */
  if (codingCount !== distribution.coding) {
    console.log(
      `Expected ${distribution.coding} coding questions but received ${codingCount}`
    );

    return false;
  }

  /*
   * Validate oral count
   */
  if (oralCount !== distribution.oral) {
    console.log(
      `Expected ${distribution.oral} oral questions but received ${oralCount}`
    );

    return false;
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Generate Interview Questions
|--------------------------------------------------------------------------
*/

const generateInterviewQuestions = async ({
  resume,
  role,
  company,
  difficulty,
  questionCount,
  language = "english",
}) => {
  /*
   * Validate question count
   */
  if (![5, 10, 15].includes(questionCount)) {
    throw new ApiError(
      400,
      "Question count must be 5, 10 or 15"
    );
  }

  /*
   * Get fixed distribution
   */
  const distribution =
    getQuestionDistribution(questionCount);

  console.log(
    "QUESTION DISTRIBUTION:",
    distribution
  );

  /*
   * Resume data
   */
  const resumeData = {
    skills: resume?.skills || [],
    education: resume?.education || [],
    experience: resume?.experience || [],
    projects: resume?.projects || [],
    certifications:
      resume?.certifications || [],
  };

  /*
   * Main Prompt
   */
  const prompt = `
You are an expert technical interviewer.

Your job is to create a personalized mock
technical interview for a candidate.

TARGET ROLE:
${role}

TARGET COMPANY:
${company || "Not specified"}

DIFFICULTY:
${difficulty}

LANGUAGE:
${language}

TOTAL QUESTIONS:
${questionCount}

QUESTION DISTRIBUTION:

CODING QUESTIONS:
${distribution.coding}

ORAL QUESTIONS:
${distribution.oral}


CANDIDATE RESUME DATA
====================

SKILLS:
${JSON.stringify(resumeData.skills)}

EDUCATION:
${JSON.stringify(resumeData.education)}

EXPERIENCE:
${JSON.stringify(resumeData.experience)}

PROJECTS:
${JSON.stringify(resumeData.projects)}

CERTIFICATIONS:
${JSON.stringify(
  resumeData.certifications
)}


STRICT QUESTION RULES
=====================

1. Generate EXACTLY ${questionCount} questions.

2. Generate EXACTLY ${
    distribution.coding
  } coding questions.

3. Generate EXACTLY ${
    distribution.oral
  } oral questions.

4. There are ONLY TWO categories:

   - coding
   - oral

5. NEVER use:
   - behavioral
   - technical
   - aptitude
   - HR
   - any other category

6. "oral" means TECHNICAL ORAL QUESTION.

7. Oral questions must test technical
   knowledge verbally.

8. Do NOT generate behavioral questions.

9. Do NOT ask questions such as:
   "Tell me about yourself"
   "What is your weakness?"
   "Where do you see yourself?"
   "Tell me about a conflict."

10. Oral questions can cover:
    - technical concepts
    - architecture
    - backend concepts
    - database concepts
    - API design
    - debugging
    - project implementation
    - technologies mentioned in resume
    - practical technical decisions

11. Coding questions must involve:
    - programming
    - algorithms
    - data structures
    - debugging
    - implementation
    - problem solving

12. Questions should be relevant to the
    target role.

13. Questions should be personalized using
    the candidate resume.

14. NEVER invent a technology, project,
    company, skill or experience that is not
    present in the resume.

15. Difficulty must match:
${difficulty}

16. Generate questions in:
    LANGUAGE: English

17. If language is "hinglish", use natural
Hindi-English mixed language.

18. Do not duplicate questions.

19. Every question must have an expectedAnswer.

20. Return ONLY JSON.

21. Do not return markdown.

22. Do not return explanations outside JSON.


IMPORTANT DISTRIBUTION
======================

TOTAL:
${questionCount}

CODING:
${distribution.coding}

ORAL:
${distribution.oral}


OUTPUT FORMAT
=============

{
  "questions": [
    {
      "question": "string",
      "category": "coding",
      "expectedAnswer": "string"
    }
  ]
}
`;

  /*
   * First AI attempt
   */
  let result = await askGemini(prompt);

  let questions = result?.questions;

  /*
   * Validate first response
   */
  if (
    validateQuestions(
      questions,
      questionCount,
      distribution
    )
  ) {
    return {
      questions,
      distribution,
    };
  }

  /*
   * Retry
   */
  console.log(
    "AI returned invalid questions. Retrying..."
  );

  const retryPrompt = `
Your previous response was INVALID.

Generate the interview again.

You MUST follow these exact numbers.

TOTAL QUESTIONS:
${questionCount}

CODING QUESTIONS:
${distribution.coding}

ORAL QUESTIONS:
${distribution.oral}

ALLOWED CATEGORIES:

"coding"
"oral"

NO OTHER CATEGORY IS ALLOWED.

ORAL MEANS TECHNICAL ORAL QUESTIONS ONLY.

DO NOT generate behavioral questions.

TARGET ROLE:
${role}

TARGET COMPANY:
${company || "Not specified"}

DIFFICULTY:
${difficulty}

LANGUAGE:
${language}


CANDIDATE RESUME:

SKILLS:
${JSON.stringify(resumeData.skills)}

EDUCATION:
${JSON.stringify(resumeData.education)}

EXPERIENCE:
${JSON.stringify(resumeData.experience)}

PROJECTS:
${JSON.stringify(resumeData.projects)}

CERTIFICATIONS:
${JSON.stringify(
  resumeData.certifications
)}


STRICT REQUIREMENTS:

Generate EXACTLY ${questionCount} questions.

Generate EXACTLY ${
    distribution.coding
  } coding questions.

Generate EXACTLY ${
    distribution.oral
  } oral questions.

Every question must contain:

question
category
expectedAnswer

Return ONLY JSON.

Format:

{
  "questions": [
    {
      "question": "string",
      "category": "coding",
      "expectedAnswer": "string"
    }
  ]
}
`;

  /*
   * Second attempt
   */
  result = await askGemini(
    retryPrompt
  );

  questions = result?.questions;

  /*
   * Validate second response
   */
  if (
    !validateQuestions(
      questions,
      questionCount,
      distribution
    )
  ) {
    throw new ApiError(
      500,
      "AI could not generate the requested question set"
    );
  }

  return {
    questions,
    distribution,
  };
};

export {
  generateInterviewQuestions,
};