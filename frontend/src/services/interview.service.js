import api from "../lib/axios";


const interviewService = {
  generateInterview: async (data) => {
    const response = await api.post(
      "/interviews/generate",
      data
    );

    return response.data;
  },

  getInterview: async (interviewId) => {
    const response = await api.get(
      `/interviews/${interviewId}`
    );

    return response.data;
  },

  startInterview : async (interviewId) => {
  return api.patch(
    `/interviews/${interviewId}/start`
  );
},

  getActiveInterview: async () => {
  const response = await api.get(
    "/interviews/active"
  );

  return response.data;
},

  submitAnswer: async (
    interviewId,
    questionId,
    answer
  ) => {
    const response = await api.post(
      `/interviews/${interviewId}/questions/${questionId}/answer`,
      {
        answer,
      }
    );

    return response.data;
  },
  evaluateInterview: async (interviewId) => {
  const response = await api.post(
    `/interviews/${interviewId}/evaluate`
  );

  return response.data;
},
getInterviewEvaluation: async (interviewId) => {
  const response = await api.get(
    `/interviews/${interviewId}/evaluation`
  );

  return response.data;
},

getInterviewHistory: async () => {
  const response = await api.get(
    "/interviews/history"
  );

  return response.data;
},
};


export default interviewService;