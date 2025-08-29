const express = require("express");
const { aiDetection, QUESTIONS } = require("./index");

const app = express();
app.use(express.json());

app.get("/results", async (req, res) => {
    const question = req.query.question;
    try {
        if (question) {
            const result = await aiDetection(question);
            res.json([result]);
        } else {
            const results = await Promise.all(QUESTIONS.map(q => aiDetection(q)));
            res.json(results);
        }
    } catch (error) {
        console.error(`Error occurred while processing question "${question}":`, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = app;
