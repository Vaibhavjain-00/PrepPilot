import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeInterview: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  isInterviewActive: false,
};

const interviewSlice = createSlice({
  name: "interview",

  initialState,

  reducers: {
    setActiveInterview: (state, action) => {
      state.activeInterview = action.payload;

      state.isInterviewActive =
        action.payload?.status === "in-progress";
    },

    setCurrentInterviewQuestion: (
      state,
      action
    ) => {
      state.currentQuestion =
        action.payload.question;

      state.currentQuestionIndex =
        action.payload.index;
    },

    nextInterviewQuestion: (
      state,
      action
    ) => {
      state.currentQuestion =
        action.payload.question;

      state.currentQuestionIndex =
        action.payload.index;
    },

    finishInterview: (state) => {
      state.activeInterview = null;
      state.currentQuestion = null;
      state.currentQuestionIndex = 0;
      state.isInterviewActive = false;
    },

    clearInterview: (state) => {
      state.activeInterview = null;
      state.currentQuestion = null;
      state.currentQuestionIndex = 0;
      state.isInterviewActive = false;
    },
  },
});

export const {
  setActiveInterview,
  setCurrentInterviewQuestion,
  nextInterviewQuestion,
  finishInterview,
  clearInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;