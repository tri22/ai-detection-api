const express = require('express');
const app = require("./app");
const PORT = 3000;

// Simulate API calls - DO NOT MODIFY
const callModel = async (modelName, delay, successRate) => {
    await new Promise(r => setTimeout(r, delay));
    if (Math.random() > successRate) throw new Error(`${modelName}
failed`);
    return {
        model: modelName,
        confidence: 0.5 + Math.random() * 0.5,
        result: Math.random() > 0.5 ? 'Human' : 'AI'
    };
};
const modelA = () => callModel('ModelA', 1000, 0.9);
const modelB = () => callModel('ModelB', 2000, 0.7);
const modelC = () => callModel('ModelC', 3000, 0.95);

// questions
const QUESTIONS = [
    "Tell me about yourself",
    "Why this company?",
    "Greatest weakness?",
    "Describe a challenge you solved",
    "Where do you see yourself in 5 years?"
];


const aiDetection = async (question) => {

    // Validate question
    if (!QUESTIONS.includes(question)) {
        return {
            error: 'Invalid question',
            validQuestions: QUESTIONS
        };
    }

    const start = Date.now();
    const failures = []

    // Helper func
    const tryModel = async (fn) => {
        try {
            const res = await fn();
            return res;
        } catch (err) {
            failures.push(err.message);
            return null;
        }
    };


    let result = await tryModel(modelA);
    if (!result) result = await tryModel(modelB);
    if (!result) result = await tryModel(modelC);
    if (!result) {
        // All failed
        return {
            question,
            error: 'All models failed',
            failures,
            timeTaken: Date.now() - start
        };
    }
    return {
        question: question,
        model: result.model,
        confidence: Number(result.confidence.toFixed(2)),
        result: result.result,
        timeTaken: Date.now() - start
    };
};


module.exports = { aiDetection, QUESTIONS };


// If I had 30 more minutes, I would first improve the test coverage,
// focusing on error handling.
