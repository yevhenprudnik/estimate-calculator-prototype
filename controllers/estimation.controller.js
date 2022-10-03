const estimationService = require('../services/estimation.service');

class EstimationController {
  
  async startEstimation(req, res){
    const firstQuestion = await estimationService.startEstimation();

    res.json(firstQuestion);
  }

  async estimation(req, res){
    const nextQuestions = await estimationService.estimate(req.body);

    res.json(nextQuestions)
  }

  async back(req, res){
    const previousQuestion = await estimationService.back(req.body);

    res.json(previousQuestion);
  }

}

module.exports = new EstimationController();