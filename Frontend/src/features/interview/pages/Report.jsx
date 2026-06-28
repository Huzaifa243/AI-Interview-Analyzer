import React, { useState, useEffect } from "react";
import { Code2, UserRound, Map } from "lucide-react";
import "../style/report.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useParams } from "react-router";
import { LogOut } from "lucide-react";
import { Sparkles } from "lucide-react";
import { FileText } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useNavigate } from "react-router";

const Report = () => {

  // Later API se replace kar dena
//   const report = {
//     matchScore: 92,
//     title: "Full Stack Developer Intern - Interview Preparation Report for Aarav Sharma",

//     technicalQuestions: [
//       {
//         question: "Can you explain the difference between Virtual DOM and Real DOM?",
//         intention:
//           "Check React fundamentals and rendering knowledge.",
//         answer:
//           "Explain that React updates Virtual DOM first, compares changes using Diffing Algorithm and updates only changed nodes."
//       },
//       {
//         question: "How does Async Await work in JavaScript?",
//         intention:
//           "Evaluate asynchronous programming knowledge.",
//         answer:
//           "Explain Promises, event loop and why async/await improves readability."
//       },
//       {
//         question: "Explain Middleware in Express.",
//         intention:
//           "Backend request lifecycle understanding.",
//         answer:
//           "Middleware executes before controller and can modify req/res or call next()."
//       }
//     ],

//     behaviouralQuestions: [
//       {
//         question:
//           "Tell me about a difficult bug you solved.",
//         intention:
//           "Problem solving ability.",
//         answer:
//           "Use STAR Method."
//       },

//       {
//         question:
//           "How do you learn new technologies quickly?",
//         intention:
//           "Learning mindset.",
//         answer:
//           "Documentation + small projects + consistency."
//       }
//     ],

//     skillGaps: [
//       {
//         skill: "Redis",
//         severity: "high"
//       },
//       {
//         skill: "Docker",
//         severity: "medium"
//       },
//       {
//         skill: "TypeScript",
//         severity: "low"
//       }
//     ],

//     preparationPlan: [
//       {
//         day:1,
//         focus:"JavaScript",
//         tasks:[
//           "Closures",
//           "Promises",
//           "Event Loop"
//         ]
//       },
//       {
//         day:2,
//         focus:"React",
//         tasks:[
//           "Hooks",
//           "Context API",
//           "Performance"
//         ]
//       },
//       {
//         day:3,
//         focus:"Node + Express",
//         tasks:[
//           "Middleware",
//           "REST APIs",
//           "Authentication"
//         ]
//       }
//     ]
//   };



  const [section,setSection] = useState("technical");

  const [openQuestion,setOpenQuestion] = useState(0);

  const { report, getReportById, loading, loadingMessage, getResumePdf } = useInterview()

  const { handleLogout } = useAuth();
  
  const navigate = useNavigate();

  const { interviewId } = useParams()

  const logoutUser = async () => {
    const success = await handleLogout();
    if(success){
        navigate("/login");
    }
  }

  useEffect(() => {
    if (interviewId) {
        getReportById(interviewId)
    }
  }, [ interviewId ])

  if (loading || !report) {
    return (
        <main className="loading-screen">
            <h1>{loadingMessage}</h1>
        </main>
    )
  }

  const renderQuestions=(questions)=>{

    return questions.map((item,index)=>(

      <div
      className="question-card"
      key={index}
      >

        <div
        className="question-header"
        onClick={()=>setOpenQuestion(openQuestion===index?-1:index)}
        >

          <div className="question-number">

            Q{index+1}

          </div>

          <h3>

            {item.question}

          </h3>

          <span>

            {openQuestion===index?"−":"+"}

          </span>

        </div>

        {

          openQuestion===index &&

          <div className="question-body">

            <div className="info-box">

              <h4>Interviewer's Intention</h4>

              <p>

                {item.intention}

              </p>

            </div>

            <div className="info-box">

              <h4>Model Answer</h4>

              <p>

                {item.answer}

              </p>

            </div>

          </div>

        }

      </div>

    ));

  }

  return (

    <div className="report-page">

      <div className="sidebar">

        <h2>Sections</h2>

        <button
            className={section === "technical" ? "active" : ""}
            onClick={() => setSection("technical")}
        >
            <Code2 size={18} />
            <span>Technical Questions</span>
        </button>

        <button
            className={section === "behavioural" ? "active" : ""}
            onClick={() => setSection("behavioural")}
        >
            <UserRound size={18} />
            <span>Behavioural Questions</span>
        </button>

        <button
            className={section === "roadmap" ? "active" : ""}
            onClick={() => setSection("roadmap")}
        >
            <Map size={18} />
            <span>Road Map</span>
        </button>

        <div className="sidebar-download">

            <button 
            onClick={()=> {getResumePdf(interviewId)}}
            className="download-btn">

                <Sparkles size={18} />
                <span>Download AI Resume</span>

            </button>

            <button
              onClick={logoutUser}
              className="download-btn"
            >
              <LogOut size={18} style={{ marginRight: "8px" }} />
              <span>Logout</span>
            </button>

        </div>

      </div>

      <div className="content">

        <div className="page-title">

          <h1>

            {report.title}

          </h1>

        </div>

        {

          section==="technical" &&

          <>

            <div className="section-title">

              Technical Questions

            </div>

            {

              renderQuestions(report.technicalQuestions)

            }

          </>

        }

        {

          section==="behavioural" &&

          <>

            <div className="section-title">

              Behavioural Questions

            </div>

            {

              renderQuestions(report.behaviouralQuestions)

            }

          </>

        }

        {

          section==="roadmap" &&

          <div className="roadmap">

            {

              report.preparationPlan.map((day,index)=>(

                <div
                className="roadmap-card"
                key={index}
                >

                  <div className="day">

                    Day {day.day}

                  </div>

                  <h3>

                    {day.focus}

                  </h3>

                  <ul>

                    {

                      day.tasks.map((task,i)=>(

                        <li key={i}>

                          ✓ {task}

                        </li>

                      ))

                    }

                  </ul>

                </div>

              ))

            }

          </div>

        }

      </div>

      <div className="right-panel">

        <div className="score-card">

          <div className="circle">

            <span>

              {report.matchScore}%

            </span>

          </div>

          <h3>

            Strong Match

          </h3>

        </div>

        <div className="skill-card">

          <h3>

            Skill Gaps

          </h3>

          {

            report.skillGaps.map((item,index)=>(

              <div
              key={index}
              className={`skill ${item.severity}`}
              >

                {item.skill}

              </div>

            ))

          }

        </div>

      </div>

    </div>

  );

};

export default Report;

