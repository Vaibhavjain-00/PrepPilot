import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const interviewService = {
  generateInterview: async (data) => {
    const response = await axiosInstance.post(
      "/interviews/generate",
      data
    );

    return response.data;
  },

  getInterview: async (interviewId) => {
    const response = await axiosInstance.get(
      `/interviews/${interviewId}`
    );

    return response.data;
  },

  getActiveInterview: async () => {
  const response = await axiosInstance.get(
    "/interviews/active"
  );

  return response.data;
},

  submitAnswer: async (
    interviewId,
    questionId,
    answer
  ) => {
    const response = await axiosInstance.post(
      `/interviews/${interviewId}/questions/${questionId}/answer`,
      {
        answer,
      }
    );

    return response.data;
  },
  evaluateInterview: async (interviewId) => {
  const response = await axiosInstance.post(
    `/interviews/${interviewId}/evaluate`
  );

  return response.data;
},
getInterviewEvaluation: async (interviewId) => {
  const response = await axiosInstance.get(
    `/interviews/${interviewId}/evaluation`
  );

  return response.data;
},
getInterviewHistory: async () => {
  const response = await axiosInstance.get(
    "/interviews/history"
  );

  return response.data;
},
};


export default interviewService;