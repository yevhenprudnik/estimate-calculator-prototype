const { Schema, SchemaTypes, model } = require('mongoose');

const QuestionSchema = new Schema({
  parents: [{ type: SchemaTypes.ObjectId, ref: "Question" }],
  position: { type: Number },
  title: { type: String, required: true },
  answerType: { type: String, required: true},
  minHours: { type: Number, required: true },
  maxHours: { type: Number, required: true },
  questionsToCheck: [{ type: SchemaTypes.ObjectId, ref: "Question" }],
  options: [{ type: SchemaTypes.ObjectId, ref: "Question" }]
},{ timestamps: true })

module.exports = model('Question', QuestionSchema);