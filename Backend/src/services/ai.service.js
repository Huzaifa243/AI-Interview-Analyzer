const { GoogleGenAI, HarmSeverity } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const interviewReportModel = require("../models/interviewReport.model")
const puppeteer = require("puppeteer")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// async function invokeGeminiAi() {

//     const response = await ai.models.generateContent({
//         model:"gemini-3.5-flash",
//         contents: "Hello gemini! Explain what is Interview ?"
//     })

//     console.log(response.text)

// }


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe."),
    technicalQuestions : z.array(z.object({
        question: z.string().describe("The technical questions that can be asked in the interview."),
        intention: z.string().describe("The intention if interviewer behind asking this question."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them."),
    behaviouralQuestions : z.array(z.object({
        question: z.string().describe("The technical questions that can be asked in the interview."),
        intention: z.string().describe("The intention if interviewer behind asking this question."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioural questions that can be asked in the interview along with their intention and how to answer them."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking."),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances.")
    })).describe("List of skill gaps in the candidate's profile along with their severity."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1."),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively."),
    title: z.string().describe("The title of the job for which the interview report is generated.")
})
  

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

        
    try {   ///   Generate an interview report for a candidate with the following details:

        const prompt = `
        You are an interview preparation expert.

        Return ONLY valid JSON.

        Return exactly one JSON object.
        Do not append any extra characters after the closing }.

        Do NOT return markdown.
        Do NOT return code blocks.
        Do NOT return explanations.

        Return EXACTLY this structure:

        {
            "matchScore": number,
            "technicalQuestions": [
                {
                    "question": string,
                    "intention": string,
                    "answer": string
                }
            ],
            "behaviouralQuestions": [
                {
                    "question": string,
                    "intention": string,
                    "answer": string
                }
            ],
            "skillGaps": [
                {
                    "skill": string,
                    "severity": "low" | "medium" | "high"
                }
            ],
            "preparationPlan": [
                {
                    "day": number,
                    "focus": string,
                    "tasks": [string]
                }
            ],
            "title": string
        }

        Requirements:
        - Generate exactly 5 technical questions
        - Generate exactly 3 behavioural questions
        - Generate exactly 3 skill gaps
        - Generate a 7-day preparation plan

         Resume:
        ${resume}

        Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}
        `

        console.log("Before Gemini Call");

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",   //// gemini-3-flash-preview          gemini-2.5-flash        gemini-3.5-flash
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // responseSchema: zodToJsonSchema(interviewReportSchema)
            }
        })

        console.log("After Gemini Call");
        
        return JSON.parse(response.text);

        // const parsedResponse = JSON.parse(response.text);
        // const validatedResponse = interviewReportSchema.parse(parsedResponse);

        // console.log("Schema Validation Successful");

        // return validatedResponse;
        

    } catch (err) {

        console.error("Gemini Error:");
        console.error(err);

        if (err.stack) {
            console.error(err.stack);
        }

        return {
            success: false,
            message: err.message
        };

    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "8mm",
            bottom: "8mm",
            left: "8mm",
            right: "8mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    // const prompt = `Generate resume for a candidate with the following details:
    //                     Resume: ${resume}
    //                     Self Description: ${selfDescription}
    //                     Job Description: ${jobDescription}

    //                     the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
    //                     The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
    //                     The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
    //                     you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
    //                     The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
    //                     The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
    //                 `

    const prompt = `
You are a senior resume writer with 15+ years of experience creating ATS-optimized resumes for software engineers.

Your task is to generate a COMPLETE professional HTML resume based on the following information.

==========================
CANDIDATE INFORMATION
==========================

Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

==========================
OUTPUT REQUIREMENTS
==========================

Return ONLY a valid JSON object in the following format:

{
  "html": "<complete html here>"
}

Do not return markdown.
Do not return explanations.
Do not wrap the HTML inside markdown code blocks.
Return ONLY JSON.

==========================
HTML REQUIREMENTS
==========================

Generate a COMPLETE HTML document including:

<!DOCTYPE html>
<html>
<head>
<style>
...
</style>
</head>
<body>
...
</body>
</html>

The HTML must contain inline CSS inside the <style> tag.

The design should be:

• Modern
• Professional
• Clean
• ATS Friendly
• Minimal
• Printable
• Black text on white background
• No animations
• No JavaScript
• No external CSS
• No external fonts
• No external libraries

Everything must work offline.

==========================
RESUME STRUCTURE
==========================

Generate these sections whenever information is available.

1. Header
- Full Name
- Job Title
- Email
- Phone
- Location
- LinkedIn
- GitHub
- Portfolio

2. Professional Summary

3. Technical Skills

Group skills into categories:

Programming Languages

Frontend

Backend

Databases

Frameworks

Developer Tools

Cloud

Other Technologies

4. Education

5. Projects

For every project include:

• Project Name

• Short Description

• Technologies Used

• Responsibilities

• Achievements

6. Internship / Experience

7. Certifications

8. Achievements

9. Languages

10. Interests (only if suitable)

==========================
OPTIMIZATION RULES
==========================

The resume must be tailored specifically according to the provided Job Description.

If the Job Description emphasizes:

React

Node

Express

MongoDB

Docker

REST APIs

Git

Authentication

JavaScript

then highlight those skills prominently if they exist in the candidate information.

Reorder skills according to importance for the target role.

Improve wording while keeping information truthful.

Do NOT invent fake companies.

Do NOT invent fake projects.

Do NOT invent fake experience.

If something is missing, simply omit that section.

==========================
ATS RULES
==========================

Use standard headings.

Avoid tables.

Avoid icons.

Avoid progress bars.

Avoid star ratings.

Avoid images.

Avoid photos.

Avoid emojis.

Use proper semantic HTML tags.

Use bullet points where appropriate.

Use readable fonts.

Keep spacing consistent.

The generated resume should score very high in ATS parsing.

==========================
DESIGN REQUIREMENTS
==========================

Page Width:
Approximately A4

Margins:
20mm

Typography:

Name:
32px
Bold

Section Headings:
18px

Body:
11px

Line Height:
1.5

Use subtle colors only for section headings.

Use thin separators.

Professional spacing.

Maximum length:
2 pages.

==========================
IMPORTANT
==========================

The resume must feel like it was written by an experienced human resume writer.

Do NOT make it sound AI-generated.

Use concise professional language.

Make the resume visually attractive while remaining ATS compatible.

Return ONLY the JSON object containing the HTML.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}    

module.exports = { generateInterviewReport, generateResumePdf }