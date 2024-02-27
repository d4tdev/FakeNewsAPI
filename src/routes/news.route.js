const NewController = require('../controllers/news.controller');

const router = require('express').Router();

router.get('/', NewController.getAllNews);
router.post('/', NewController.createNews);
router.get('/:id', NewController.getANews);
router.put('/:id', NewController.updateANews);
router.delete('/:id', NewController.deleteANews);

module.exports = router;
