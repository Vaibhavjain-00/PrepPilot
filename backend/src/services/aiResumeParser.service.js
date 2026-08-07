import ai from "../config/gemini.js";
import { ApiError } from "../utils/ApiError.js";

const cleanJson = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const askGemini = async (resumeText) => {
  const prompt = `
You are an expert ATS Resume Parser.

Your task is to extract structured information from the resume.

Return ONLY valid JSON.

Do NOT write markdown.

Do NOT write explanation.

Do NOT wrap inside \`\`\`json.

If something is missing return empty array.

Schema:

{
  "skills":[
    "Java",
    "React"
  ],

  "education":[
    {
      "degree":"",
      "institution":"",
      "year":"",
      "score":""
    }
  ],

  "experience":[
    {
      "company":"",
      "role":"",
      "duration":"",
      "description":""
    }
  ]
  "projects":[
    {
      title: "",
      description: "",
      technologies: [],
    }
  ]
}

Rules:

- Extract ONLY explicitly written skills.
- Remove duplicate skills.
- Do NOT include projects inside experience.
- Do NOT guess missing information.

Resume:

${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Empty AI response");
    }

    console.log("===== GEMINI RAW RESPONSE =====");
    console.log(text);
    console.log("===============================");
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.log(error);

    throw new ApiError(500, `Resume parsing failed : ${error.message}`);
  }
};

export const parseResumeWithAI = async (resumeText) => {
  return await askGemini(resumeText);
};
