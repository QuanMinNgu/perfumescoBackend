const router = require('express').Router();
const userController = require('../controllers/userController');
const middleWareController = require('../controllers/middleWareController');

router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/getall',middleWareController.verifyAdmin,userController.getUsers);

router.get('/getone/:id',middleWareController.verifyUser,userController.adminGetOne);

router.delete('/delete/:id',middleWareController.verifyAdmin,userController.deleteUser);

router.post('/change_password',middleWareController.verifyUser,userController.changePassword);

router.put('/update/me',middleWareController.verifyUser,userController.addCart);

router.put('/update',middleWareController.verifyUser,userController.updateUser);

router.post('/replace/:id',middleWareController.verifyUser,userController.replaceCart);

router.post('/addcount/:id',middleWareController.verifyUser,userController.addCount);

router.post('/get_password',middleWareController.verifyAdmin,userController.getPassword);

router.post('/deleteall',middleWareController.verifyUser,userController.deleteAllCart);

router.post('/logout',userController.logout);

module.exports = router;