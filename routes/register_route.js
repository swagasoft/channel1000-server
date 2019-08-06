const express = require('express');
const router = express.Router();

const controlUser = require('../controller/user.controller');
const contactController = require('../controller/server-control');
jwt_helper = require('../config/jwt_helper');


router.post('/register', controlUser.register);
router.get('/contact',  contactController.homePage);
router.post('/contact',  contactController.submitForm);
router.post('/authenticate', controlUser.authenticate);
router.get('/dashboard',jwt_helper.verifyJwtToken ,controlUser.userDashboard);
router.get('/edit_account',jwt_helper.verifyJwtToken ,controlUser.editAccount);

router.get('/', controlUser.index);

module.exports = router;
