const router = require('express').Router();
const brandController = require('../controllers/brandController');
const middleWareController = require('../controllers/middleWareController');
router.delete('/delete/:slug',middleWareController.verifyAdmin,brandController.deleteBrand);
router.put('/update/:slug',middleWareController.verifyAdmin,brandController.updateBrand);
router.post('/create',middleWareController.verifyAdmin,brandController.createBrand);
router.get('/:categary',brandController.getBrandReply);
router.get('/getone/:slug',brandController.getone);
router.get('/',brandController.getBrand);

module.exports = router;