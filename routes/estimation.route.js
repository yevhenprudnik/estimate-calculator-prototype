const estimationController = require('../controllers/estimation.controller');

const Router = require('express').Router;
const router = new Router();

router.get('/', estimationController.startEstimation);
router.post('/', estimationController.estimation);
router.post('/back', estimationController.back);

module.exports = router;