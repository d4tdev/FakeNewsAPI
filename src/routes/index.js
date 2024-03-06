const bookRoute = require('./news.route');
const auth = require('./authen.route');

const routes = (app) => {
   app.use('/news', bookRoute);
   app.use('/auth',auth);
}

module.exports = routes;
