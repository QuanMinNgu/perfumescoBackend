const product = require('./product');
const categary = require('./categary');
const brand = require('./brand');
const user = require('./user');
const commentrouter =   require('./commentrouer');
function router(app){
    app.use('/api/product',product);
    app.use('/api/categary',categary);
    app.use('/api/brand',brand);
    app.use('/api/user',user);
    app.use('/api/comment',commentrouter);
}

module.exports = router;