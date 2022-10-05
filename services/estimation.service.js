const questionModel = require("../models/question.model");
const userModel = require("../models/user.model");
const ApiError = require("../exceptions/api-eror");

class EstimationService {
  
  async startEstimation(){
    const firstQuestion = await questionModel
    .findOne({ title: "Please, choose your industry" }, ['_id', 'title', 'answerType'])
    .populate({ path: 'options', select: 'title answerType'});

    const user = await userModel.create({ minHours: 0, maxHours: 0});

    return {questions: firstQuestion, userId: user.id};
  }

  async estimate(input){
    const { answers, userId } = input;
    if (!answers || !userId) {
      throw ApiError.BadRequest("Answers and UserId are required");
    }
    const nextQuestions = [];

    const user = await userModel.findById(userId);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }

    for (const answer of answers) {
      const answerFromDb = await questionModel.findById(answer.id);
      if (!answerFromDb) {
        throw ApiError.NotFound(`Answer ${JSON.stringify(answer)} not found`);
      }
      const selected = user.selectedOptions.find(option => option.id === answer.id);

      if (!selected) {
        user.minHours += answerFromDb.minHours;
        user.maxHours += answerFromDb.maxHours;

        user.selectedOptions.push(answer);
      }
      if (answerFromDb.answerType !== 'options') {
        nextQuestions.push(...answerFromDb.options);
      }
    }

    const questionsToSend = await questionModel
    .find({ '_id': { $in : nextQuestions }}, 
    ['_id', 'title', 'answerType', 'questionsToCheck'] )
    .populate({ 
      path: 'options', 
      select: 'title answerType options position',
      options: { sort: { 'position': -1} },
      populate: { 
        path: 'options',
        select: 'title answerType position', 
        options: { sort: { 'position': 1} }
      }
    })

    if(questionsToSend.length  === 1 &&
      user.questionStack.length && 
      questionsToSend[0].questionsToCheck.length){

      for (const stackQuestion of user.questionStack) {

        if (questionsToSend[0].questionsToCheck.includes(stackQuestion)){

          const question = await questionModel
          .findOne({ '_id': stackQuestion }, 
          ['_id', 'title', 'answerType'] )
          .populate({ 
            path: 'options', 
            select: 'title answerType options position',
            options: { sort: { 'position': -1} },
            populate: { 
              path: 'options',
              select: 'title answerType position', 
              options: { sort: { 'position': 1} },
              match: { answerType: "options"} 
            }
          })

          const index = user.questionStack.indexOf(stackQuestion);
          user.questionStack.splice(index, 1);
          await user.save();

          return {
            question: question, 
            userId: user.id, 
            hours: {
              minHours: user.minHours, 
              maxHours: user.maxHours 
            }
          };

        }
      }
    }

    for (let i = 0; i < questionsToSend.length-1; i++) {
      user.questionStack.push(questionsToSend[i].id);
    }

    await user.save();

    return {
      question: questionsToSend[questionsToSend.length - 1], 
      userId: user.id, 
      hours: {
        minHours: user.minHours, 
        maxHours: user.maxHours 
      }
    };
  }

  async back(input){
    const { userId, questionId } = input;

    if (!userId || !questionId) {
      throw ApiError.BadRequest("UserId and questionId are required");
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }

    let previousQuestion = { id: questionId};

    while (previousQuestion.id === questionId) {

      const lastElement = user.selectedOptions.pop();
      if (!lastElement){
        throw ApiError.BadRequest("There's no way back!")
      }
      const lastAnswerId = lastElement.id;
  
      const lastAnswer = await questionModel.findById(lastAnswerId);
  
      user.maxHours -= lastAnswer.maxHours;
      user.minHours -= lastAnswer.minHours;
  
      previousQuestion = await questionModel
        .findById(lastAnswer.parents[0])
        .populate({ 
        path: 'options', 
        select: 'title answerType options',
        populate: { path: 'options', select: 'title answerType', }
      });

    }
    await user.save();

    return {
      question: previousQuestion, 
      userId: user.id, 
      hours: {
        minHours: user.minHours, 
        maxHours: user.maxHours 
      }
    };
  }

}

module.exports = new EstimationService();