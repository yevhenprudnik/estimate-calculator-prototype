const questionsService = require('../services/question.service');

class QuestionsController {
  
  async addQuestion(req, res){
    const question = await questionsService.addQuestion(req.body);

    res.json(question);
  }

  async updateQuestion(req, res){
    const question = await questionsService.updateQuestion(req.body);

    res.json(question);
  }

  async getQuestions(req, res){
    const questions = await questionsService.getQuestions(req.body);

    res.json(questions);
  }

}

module.exports = new QuestionsController();