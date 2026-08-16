import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import interviewService from "../services/interview.service.js";

import {
  setActiveInterview,
  clearInterview,
} from "../store/interviewSlice";

const ActiveInterviewBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeInterview,
    isInterviewActive,
  } = useSelector(
    (state) => state.interview
  );

  useEffect(() => {
    const restoreActiveInterview = async () => {
      // Redux already has active interview
      if (activeInterview) {
        return;
      }

      try {
        const response =
          await interviewService.getActiveInterview();

        const interview =
          response.data?.interview;

        if (interview) {
          dispatch(
            setActiveInterview(interview)
          );
        } else {
          dispatch(clearInterview());
        }
      } catch (error) {
        console.error(
          "Failed to restore active interview:",
          error
        );
      }
    };

    restoreActiveInterview();
  }, [activeInterview, dispatch]);

  if (
    !isInterviewActive ||
    !activeInterview
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[90%] max-w-3xl -translate-x-1/2">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">

        <div>
          <p className="font-semibold text-gray-900">
            Interview in progress
          </p>

          <p className="text-sm text-gray-500">
            {activeInterview.role}

            {activeInterview.company &&
              ` • ${activeInterview.company}`}
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              `/interview/${activeInterview._id}`
            )
          }
          className="whitespace-nowrap rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Back to Interview
        </button>

      </div>
    </div>
  );
};

export default ActiveInterviewBar;