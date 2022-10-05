const questionModel = require("../models/question.model");

class QuestionsService {
  
  async addQuestion(input){
    return questionModel.create(input);
  }

  async updateQuestion(input){
    const { id, ...rest } = input;
    const question = await questionModel.findOneAndUpdate({ _id: id }, rest, {new: true});

    return question;
  }

  async getQuestions(){
    return questionModel.find().populate({ path: 'parents options', select: 'title'});
  }

}

module.exports = new QuestionsService();