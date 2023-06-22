const router = require("express").Router();
const { generateFile } = require('../models/generateFile');
const { executeCpp } = require('../models/executeCpp');



app.post("/run", async (req, res) => {


    const { language = 'cpp', code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const output = await executeCpp(filePath);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});