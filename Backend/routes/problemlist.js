const express = require("express");
const router = express.Router();
const Problem =  require('../models/Problem');
const Submission = require('../models/Submission');
const generateFile = require("../generateFile");
const executeCode = require("../executeCpp");

// problems getter route
router.get("/problems", async (req, res) => {
  try {
    const allProblems = await Problem.find({});
    res.send(allProblems);
  } catch (err) {
    console.log(err);
  }
});

router.post("/addproblems", async (req, res) => {
  const {
    title,
    description,
    difficultyLevel,
    topicTag,
    problemConstraints,
    sampleInput,
    sampleOutput,
    exampleInput,
    exampleOutput,
    problemId
  } = req.body;

  if (
    !title ||
    !description ||
    !difficultyLevel ||
    !topicTag ||
    !problemConstraints ||
    !sampleInput ||
    !sampleOutput ||
    !exampleInput ||
    !exampleOutput ||
    !problemId
  ) {
    return res.status(422).json({ error: "You're missing some fields" });
  }

  try {
    const problem = new Problem({
        title,
        description,
        difficultyLevel,
        topicTag,
        problemConstraints,
        sampleInput,
        sampleOutput,
        exampleInput,
        exampleOutput,
        problemId
    });
    await problem.save();
    res.status(201).json({ message: "Problem Added Successfully" });
  } catch (err) {
    console.log(err);
  }
});

// problem page getter route
router.get("/problem/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const problem = await Problem.findOne({ problemId: id });

    if (!problem) {
      return res
        .status(500)
        .json({ error: "Can't able to extract data from DB" });
    }

    res.send(problem);
  } catch (error) {
    console.error(error);
  }
});
// userdata getter route
router.get("/userdata", async (req, res) => {
  try {
    res.send(req.userdata);
  } catch (err) {
    console.error(err);
  }
});
// code runner route
router.post("/run", async (req, res) => {
  const { lang, code, input, type } = req.body;
  if (!code) {
    return res.status(404).json({ error: "Please enter some code" });
  }

  try {
    const filePath = await generateFile(lang, code);
    const output = await executeCode(filePath, lang, input, type);
    res.json({ filePath, output });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// submission adder route
router.post("/addsubmission", async (req, res) => {
  const { problemId, language, code, userId, result } = req.body;

  if (!code) {
    return res.status(422).json({ error: "Write some code" });
  }

  try {
    const submission = {
        language,
      code,
      userId,
      result,
    };

    const existingSubmission = await Submission.findOne({ problemId });
    if (existingSubmission) {
      existingSubmission.submissions.push(submission);
      await existingSubmission.save();
    } else {
      const newSubmission = new Submission({
        problemid,
        submissions: [submission],
      });
      await newSubmission.save();
    }

    res.status(201).json({ message: "Code Submitted Successfully" });
  } catch (err) {
    console.log(err);
  }
});

// submission getter route
router.get("/submissions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const submission = await Submission.findOne({ problemId: id });

    res.send(submission);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;