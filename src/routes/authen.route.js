const authenController = require('../controllers/authen.controllers');
const router = require('express').Router();

router.post('/register', authenController.register);
router.post('/login', authenController.register);
router.get('/',authenController.getAllUser);

module.exports = router;