const router = require('express').Router();
const userController = require('../controllers/userController');
const middleWareController = require('../controllers/middleWareController');

router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/refresh',userController.refreshToken);
router.get('/getall',middleWareController.verifyAdmin,userController.getUsers);
router.get('/getone/:id',middleWareController.verifyAdmin,userController.adminGetOne);
router.delete('/delete/:id',middleWareController.verifyAdmin,userController.deleteUser);
router.post('/change_password',middleWareController.verifyUser,userController.changePassword);
router.get('/me',middleWareController.verifyUser,userController.getOne);
router.post('/get_password',middleWareController.verifyAdmin,userController.getPassword);
router.post('/logout',userController.logout);

module.exports = router;