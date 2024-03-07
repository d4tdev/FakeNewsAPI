const NewController = require('../controllers/news.controller');
const middleware = require('../middlewares/checkAuthentication');
const router = require('express').Router();

router.get('/',middleware.checkLogin, NewController.getAllNews);
router.get('/getNews',middleware.checkLogin, NewController.getNews);
router.post('/',middleware.checkLogin, NewController.createNews);
router.get('/:id',middleware.checkLogin, NewController.getANews);
router.post('/update/:id',middleware.checkLogin, NewController.updateANews);
router.post('/delete/:id',middleware.checkLogin, NewController.deleteANews);


module.exports = router;
