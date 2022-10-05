const questionsController = require('../controllers/questions.controller');

const Router = require('express').Router;
const router = new Router();

router.post('/', questionsController.addQuestion);
router.patch('/', questionsController.updateQuestion);
router.get('/', questionsController.getQuestions)

module.exports = router;