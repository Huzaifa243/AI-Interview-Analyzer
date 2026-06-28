const mongoose = require("mongoose");


// user will give these informations
/**
 * Job Description Schema
 * resume text
 * Self description
 * match Score
 */

// AI will generate
/**
 * Technical questions : 
 *       [{
 *          question: "",
 *          intension: "",
 *          answer : ""
 *       }]
 * Behaviour questions : 
 *       [{
 *          question: "",
 *          intension: "",
 *          answer : ""
 *       }]
 * Skills gaps : 
 *      [{
 *          skill: "",
 *          severity: {
 *                       type: "String",
 *                       enum: ["low", "medium", "high"]
 *                    }
 *      }]
 * preparation plan : [{
 *                        day: Number,
 *                        focus: String,
 *                        tasks: [String]
 *                    }]
 */


const technicalQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required: [ true, "Technical question is required." ]
    },
    intention : {
        type: String,
        required: [ true, "Intension is required." ]
    },
    answer : {
        type: String,
        required: [ true, "Answer is required." ]
    }
}, {
    _id: false
})


const behaviouralQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required: [ true, "Technical question is required." ]
    },
    intention : {
        type: String,
        required: [ true, "Intension is required." ]
    },
    answer : {
        type: String,
        required: [ true, "Answer is required." ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill : {
        type: String,
        required: [ true, "Skill is required." ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required." ]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day : {
        type: Number,
        required: [ true, "Day is required." ]
    },
    focus : {
        type: String,
        required: [ true, "Focus is required." ]
    },
    tasks : [ {
        type: String,
        required: [ true, "Task is required." ]
    } ]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type: String,
        required : [ true, "Job description is required." ]
    },
    resume : {
        type: String,
    },
    selfDescription : {
        type: String
    },
    matchScore : {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions : [ technicalQuestionSchema ],
    behaviouralQuestions : [ behaviouralQuestionSchema ],
    skillGaps : [ skillGapSchema ],
    preparationPlan : [ preparationPlanSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required." ]
    }
}, {
    timestamps : true
})


const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema);


module.exports = interviewReportModel;
