const { Schema, SchemaTypes, model } = require('mongoose');

const QuestionSchema = new Schema({
  parent: { type: SchemaTypes.ObjectId, ref: "Question" },
  position: { type: Number },
  title: { type: String, required: true },
  answerType: { type: String, required: true},
  input: { type: String },
  minHours: { type: Number, required: true },
  maxHours: { type: Number, required: true },
  options: [{ type: SchemaTypes.ObjectId, ref: "Question" }]
},{ timestamps: true })

module.exports = model('Question', QuestionSchema);