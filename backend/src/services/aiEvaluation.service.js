import ai from "../config/gemini.js";
import { ApiError } from "../utils/ApiError.js";

const askGemini = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Empty AI response");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("INTERVIEW EVALUATION AI ERROR:", error);

    throw new ApiError(500, "Interview evaluation failed");
  }
};

const evaluateInterview = async ({ interview, questions }) => {
  const formattedQuestions = questions.map((q, index) => ({
    questionNumber: index + 1,
    question: q.question,
    category: q.category,
    expectedAnswer: q.expectedAnswer,
    candidateAnswer: q.candidateAnswer,
  }));

  const prompt = `
You are an expert technical interviewer evaluating a candidate's mock interview.

Evaluate the candidate based ONLY on the questions, expected answers, and candidate answers provided below.

INTERVIEW DETAILS:

ROLE:
${interview.role}

COMPANY:
${interview.company || "Not specified"}

DIFFICULTY:
${interview.difficulty}

QUESTIONS AND ANSWERS:

${JSON.stringify(formattedQuestions, null, 2)}

IMPORTANT EVALUATION RULES:

1. Evaluate EVERY question individually.

2. Give each question a score from 0 to 10.

3. A completely unanswered question MUST receive a score of 0.

4. Evaluate each candidate answer based on:

- correctness
- relevance
- technical understanding
- practical understanding
- clarity
- completeness

5. Do NOT give credit for information that is not actually present in the candidate's answer.

6. For coding questions, evaluate:

- correctness
- logic
- problem solving
- implementation quality
- edge cases
- efficiency where relevant

7. For oral/technical questions, evaluate:

- conceptual understanding
- practical understanding
- accuracy
- explanation quality
- depth of understanding

8. Do NOT invent candidate experience, skills, knowledge, or achievements.

9. The feedback for EVERY question must be specific to the candidate's actual answer.

10. Do NOT give generic feedback such as:

"Good answer."
"Bad answer."
"Needs improvement."

Instead, explain specifically why the answer received that score.

11. The feedback field MUST contain BOTH:

- Evaluation of what the candidate did well or poorly.
- Specific suggestions about what the candidate should improve.

12. When an answer is incomplete, incorrect, vague, or lacks depth, clearly explain what is missing and how the candidate could improve it.

13. When an answer is already strong, mention what was done well and explain how the candidate could make the answer even stronger, for example by adding practical examples, edge cases, trade-offs, or deeper technical details when relevant.

14. Keep question-level feedback concise but useful.

15. Calculate an overall score between 0 and 100 based on the candidate's performance across ALL questions.

16. Generate meaningful overall feedback based on the complete interview.

17. The overall feedback MUST NOT be empty.

18. Overall feedback should include:

- major strengths
- major weaknesses
- technical understanding
- answer quality
- important areas for improvement
- practical advice for future interviews

19. The overall feedback should be based ONLY on the candidate's actual answers.

20. Do NOT generate MongoDB IDs.

21. Return ONLY valid JSON.

REQUIRED JSON FORMAT:

{
  "evaluatedQuestions": [
    {
      "questionNumber": 1,
      "score": 0,
      "feedback": "Specific evaluation of the candidate's answer, including what was done well or poorly and exactly what the candidate should improve."
    }
  ],
  "overallScore": 0,
  "overallFeedback": "Detailed overall feedback covering the candidate's strengths, weaknesses, and specific areas they should improve for future interviews."
}

IMPORTANT:

- questionNumber MUST exactly correspond to the questionNumber provided in the input.
- Do NOT omit any question.
- Every question MUST contain questionNumber, score, and feedback.
- The feedback MUST include improvement suggestions where applicable.
- overallScore MUST be between 0 and 100.
- overallFeedback MUST be a non-empty string.
- Return ONLY JSON.
`;

  return await askGemini(prompt);
};

export { evaluateInterview };
