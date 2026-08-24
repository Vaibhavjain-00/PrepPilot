import { useEffect, useState } from "react";

import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeReview from "../components/resume/ResumeReview";
import ResumeHeader from "../components/resume/ResumeHeader";
import ResumeStats from "../components/resume/ResumeStats";
import ResumeCompleteness from "../components/resume/ResumeCompleteness";
import resumeService from "../services/resume.service";
import ActiveInterviewBar from "./ActiveInterviewBar";

function Resume() {
    const [resume, setResume] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchResume();

    }, []);

    const fetchResume = async () => {

        try {

            const response = await resumeService.getResume();

            setResume(response.data);

        } catch (error) {

            setResume(null);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="flex justify-center items-center h-screen">

                Loading...

            </div>
        );

    }

    return (
  <div className="max-w-6xl mx-auto p-6">

    {!resume ? (
      <ResumeUpload onUpload={fetchResume} />
    ) : (
      <>
  <ResumeHeader />

  <ResumeStats resume={resume} />

  <ResumeCompleteness resume={resume} />

  <ResumeReview
    resume={resume}
    refreshResume={fetchResume}
  />
</>
    )}
   <ActiveInterviewBar/>
  </div>
);

}

export default Resume;