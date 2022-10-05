const estimationService = require('../services/estimation.service');

class EstimationController {
  
  async startEstimation(req, res, next){
    try {
      const firstQuestion = await estimationService.startEstimation();

      res.json(firstQuestion);
    } catch (error) {
      next(error);
    }
  }

  async estimation(req, res, next){
    try {
      const nextQuestions = await estimationService.estimate(req.body);

      res.json(nextQuestions)
    } catch (error) {
      next(error);
    }
  }

  async back(req, res, next){
    try {
      const previousQuestion = await estimationService.back(req.body);

      res.json(previousQuestion);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new EstimationController();