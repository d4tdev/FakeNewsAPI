const authenController = require('../controllers/authen.controllers');
const router = require('express').Router();

router.post('/register', authenController.register);
router.post('/login', authenController.login);
router.get('/',authenController.getAllUser);
router.get('/getUser', authenController.getUser);

module.exports = router;
