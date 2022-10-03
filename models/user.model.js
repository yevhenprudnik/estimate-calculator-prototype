const { Schema, SchemaTypes, model } = require('mongoose');

const UserSchema = new Schema({
  fullName: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  selectedOptions: [{ type: SchemaTypes.ObjectId, ref: "Question" }],
  minHours: { type: Number },
  maxHours: { type: Number },
},{ timestamps: true })

module.exports = model('User', UserSchema);