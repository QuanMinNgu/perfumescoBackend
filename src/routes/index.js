const product = require('./product');
const categary = require('./categary');
const brand = require('./brand');
const user = require('./user');
function router(app){
    app.use('/api/product',product);
    app.use('/api/categary',categary);
    app.use('/api/brand',brand);
    app.use('/api/user',user);
}

module.exports = router;