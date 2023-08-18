const mongoose = require("mongoose");

const Problem = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    required: true,
  },
  topicTag: {
    type: String,
    required: true,
  },
  problemConstraints: {
    type: String,
    required: true,
  },
  sampleInput: {
    type: String,
    required: true,
  },
  sampleOutput: {
    type: String,
    required: true,
  },
  exampleInput: {
    type: String,
    required: true,
  },
  exampleOutput: {
    type: String,
    required: true,
  },
});

const CusProblem = mongoose.model("custom_problems", Problem);

module.exports = CusProblem;
