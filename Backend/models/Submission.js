const mongoose = require("mongoose");

const Submission = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
  },
  submissions: [
    {
      language: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      result: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const UserSubmission = mongoose.model("user_submissions", Submission);

module.exports = UserSubmission;
