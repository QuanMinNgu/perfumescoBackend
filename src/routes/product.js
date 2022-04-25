const router = require('express').Router();
const productController = require('../controllers/productController');
const middleWareController = require('../controllers/middleWareController');
router.delete('/delete/:slug',middleWareController.verifyAdmin,productController.deleteProduct);
router.put('/update/:slug',middleWareController.verifyAdmin,productController.updateProduct);
router.post('/create',middleWareController.verifyAdmin,productController.createProduct);
router.get('/getone/:slug',productController.getOneProduct);
router.get('/',productController.getProduct);

module.exports = router;