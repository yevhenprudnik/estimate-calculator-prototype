const questionsService = require('../services/question.service');

class QuestionsController {
  
  async addQuestion(req, res, next){
    try {
      const question = await questionsService.addQuestion(req.body);

      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(req, res, next){
    try {
      const question = await questionsService.updateQuestion(req.body);

      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  async getQuestions(req, res, next){
    try {
      const questions = await questionsService.getQuestions(req.body);

      res.json(questions);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new QuestionsController();