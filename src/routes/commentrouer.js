const router = require('express').Router();
const commentController = require('../controllers/commentController');
const middleWareController = require('../controllers/middleWareController');


router.put(`/update/:id`,middleWareController.verifyUser,commentController.updateComment);
router.delete(`/delete/:id`,middleWareController.verifyUser,commentController.deleteComment);
router.get(`/getone/:slug`,commentController.getComment);

module.exports = router;