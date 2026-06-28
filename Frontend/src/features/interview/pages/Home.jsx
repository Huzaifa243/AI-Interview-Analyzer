import React from "react";
import { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";


const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeName, setResumeName] = useState("");  
    const resumeInputRef = useRef()

    const navigate = useNavigate()
    const { user } = useAuth();

    const handleGenerateReport = async () => {

    const resumeFile = resumeInputRef.current.files[0];

    if (
        !resumeFile &&
        !jobDescription.trim() &&
        !selfDescription.trim()
    ) {
        toast.error("Please fill all the required fields.");
        return;
    }

    // ✅ Validation Start
    if (!resumeFile) {
        toast.error("Please upload your resume.");
        return;
    }

    if (!jobDescription.trim()) {
        toast.error("Please enter the job description.");
        return;
    }

    if (!selfDescription.trim()) {
        toast.error("Please tell us about yourself.");
        return;
    }
    // ✅ Validation End

    const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
    });

    navigate(`/interview/${data._id}`);
}

    if(loading) {
        return (
            <main className="loading-screen">
                <h1>
                    Loading your interview plan...
                </h1>
            </main>
        )
    }


  return (
    <div className="home-wrapper">

      <div className="hero">

        <h1>
          AI Interview Report <span>Generator</span>
        </h1>

        <div className="hero-badge">
            🚀 AI Powered • Resume Analysis • Interview Preparation
        </div>

        <p>
          Upload your resume, paste the job description and let AI generate
          your personalized interview preparation strategy.
        </p>

      </div>

      <main className="home">

        {/* LEFT CARD */}

        <div className="left card">

          <div className="card-header">

            <div className="title">

              📄 Target Job Description

            </div>

            <span className="badge required">
              Required
            </span>

          </div>

          <textarea
            onChange={(e) => {setJobDescription(e.target.value)}}
            id="jobDescription"
            maxLength={5000}
            placeholder="Paste the complete Job Description here...

Example:

• Required Skills
• Responsibilities
• Company Requirements
• Preferred Technologies
• Experience Needed"
          />

          <div className="field-footer">

            <span>
              AI will compare your profile against this job description.
            </span>

            <span>0 / 5000</span>

          </div>

        </div>

        {/* RIGHT CARD */}

        <div className="right card">

          <div className="card-header">

            {/* <div className="title">
              <p>👤 {user?.username} Profile</p>
            </div> */}

            {/* <div className="title">
    <span className="profile-label">Welcome,</span>
    <h3>{user?.username}</h3>
</div> */}

              <div className="title">
    <span className="profile-label">👋 Welcome Back</span>
    <h3>{user?.username}</h3>
    <p>Your Profile</p>
</div>

          </div>

          <div className="input-group">

            <div className="label-row">

              <label htmlFor="resume">

                Upload Resume

              </label>

              <span className="badge required">
                Best Results
              </span>

            </div>

            <label
                htmlFor="resume"
                className={`upload-box ${resumeName ? "uploaded" : ""}`}
            >

                {
                    resumeName ? (

                        <>

                          <div className="upload-success">
                              ✅
                          </div>
                          <h3>
                              Resume Uploaded
                          </h3>
                          <p className="file-name">
                            {resumeName}
                          </p>
                          <small>
                            <u>Click to Change Resume</u>
                          </small>
                            
                        </>

                  ) : (

                            <>
                            <div className="upload-icon">
                              ☁️
                            </div>
                            <h3>
                              Drag & Drop Resume
                            </h3>
                            <p>
                              or Click to Upload
                            </p>
                            <small>
                              PDF Only (Max 5 MB)
                            </small>
                          </>
                          )
                        }

            </label>

            <input
              ref={resumeInputRef}
              type="file"
              id="resume"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setResumeName(e.target.files[0].name);
                }
              }}
            />

          </div>

          <div className="divider">

            <span>------------------------------OR-----------------------------</span>

          </div>

          <div className="input-group">

            <div className="label-row">
                <label htmlFor="selfDescription">

                    Quick Self Description

                </label>

                <span className="badge required">
                    Recommended
                </span>
            </div>


            <textarea
              onChange={(e) => {setSelfDescription(e.target.value)}}
              id="selfDescription"
              placeholder="Tell AI about yourself...

• Your skills

• Experience

• Projects

• Interests

• Career goals"
            ></textarea>

          </div>

          <div className="tip-card">

            💡 <strong>AI Tip</strong>

            <p>

              Providing both your Resume and Self Description
              generates a much more accurate interview report.

            </p>

          </div>

          <button 
            onClick={handleGenerateReport}
            className="generate-btn">

            ✨ Generate Interview Report

          </button>

        </div>

      </main>

      {/** Recent Reports List */}

      {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2> My Recent <span>Interview Reports</span></h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

        {/* ================= Footer ================= */}

            <footer className="page-footer">

                <div className="footer-left">
                    <p>
                        © 2026 AI Interview Platform
                    </p>
                </div>

                <div className="footer-links">

                    <a href="#">
                        Privacy Policy
                    </a>

                    <a href="#">
                        Terms
                    </a>

                    <a href="#">
                        Help Center
                    </a>

                    <a href="#">
                        Contact
                    </a>

                </div>

            </footer>

    </div>
  );
};

export default Home;