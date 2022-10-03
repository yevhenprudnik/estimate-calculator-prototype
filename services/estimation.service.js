const questionModel = require("../models/question.model");
const userModel = require("../models/user.model");

class EstimationService {
  
  async startEstimation(){
    const firstQuestion = await questionModel
    .findOne({ title: "Please, choose your industry" })
    .populate({ path: 'options parent', select: 'title answerType'});

    const user = await userModel.create({ minHours: 0, maxHours: 0});

    return {questions: firstQuestion, userId: user.id};
  }

  async estimate(input){
    const { answers, userId } = input;
    const nextQuestions = [];

    const user = await userModel
    .findById(userId)
    .populate('selectedOptions');

    const questions = await questionModel
    .find( { '_id': { $in : answers }} )
    .populate({ path: "parent", select: 'title answerType'});

    for(const question of questions){
      if (!user.selectedOptions.includes(question.id)) {
        user.minHours += question.minHours;
        user.maxHours += question.maxHours;
        user.selectedOptions.push(question.id);

        nextQuestions.push(...question.options);
      } 
    }

    await user.save();

    const questionsToSend = await questionModel
    .find({ '_id': { $in : nextQuestions }} )
    .populate({ path: 'options parent', select: 'title answerType'});

    return {
      questions: questionsToSend, 
      userId: user.id, 
      hours: {
        minHours: user.minHours, maxHours: user.maxHours 
      }
    };
  }

  async back(input){
    const { userId } = input;

    const user = await userModel.findById(userId);

    const lastAnswerId = user.selectedOptions.pop();

    const lastAnswer = await questionModel.findById(lastAnswerId);

    user.maxHours -= lastAnswer.maxHours;
    user.minHours -= lastAnswer.minHours;

    const previousQuestion = await questionModel
    .findById(lastAnswer.parent)
    .populate({ path: 'options parent', select: 'title answerType'});

    await user.save();

    return previousQuestion;
  }

}

module.exports = new EstimationService();