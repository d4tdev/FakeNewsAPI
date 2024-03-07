const NewController = require('../controllers/news.controller');

const router = require('express').Router();

router.get('/', NewController.getAllNews);
router.get('/getNews', NewController.getNews);
router.post('/', NewController.createNews);
router.get('/:id', NewController.getANews);
router.post('/update/:id', NewController.updateANews);
router.post('/delete/:id', NewController.deleteANews);


module.exports = router;
