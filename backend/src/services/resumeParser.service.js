import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { ApiError } from "../utils/ApiError.js";

export const extractPdfText = async (buffer) => {
    try {
        const parser = new PDFParse({
            data: buffer,
        });

        const data = await parser.getText();

        if (!data.text || data.text.trim() === "") {
            throw new ApiError(400, "No text found in PDF");
        }

        return data.text.trim();

    } catch (error) {
        console.log("PDF PARSE ERROR:", error);
        throw new ApiError(500, "Failed to parse PDF");
    }
};

export const extractDocxText = async (buffer) => {
  try {
    const data = await mammoth.extractRawText({
      buffer,
    });

    if (!data.value || data.value.trim() === "") {
      throw new ApiError(400, "No text found in DOCX");
    }

    return data.value.trim();
  } catch (error) {
    throw new ApiError(500, "Failed to parse DOCX");
  }
};

export const parseResume = async (file) => {
  if (!file) {
    throw new ApiError(400, "Resume file is required");
  }

  switch (file.mimetype) {
    case "application/pdf":
      return await extractPdfText(file.buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return await extractDocxText(file.buffer);

    default:
      throw new ApiError(
        400,
        "Only PDF and DOCX files are supported"
      );
  }
};