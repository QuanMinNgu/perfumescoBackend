const router = require('express').Router();
const categaryController = require('../controllers/categaryController');
const middleWareController = require('../controllers/middleWareController');
router.post('/create',middleWareController.verifyAdmin,categaryController.createCategary);
router.delete('/delete/:slug',middleWareController.verifyAdmin,categaryController.deleteCategary);
router.get('/',categaryController.getCategary);

module.exports = router;