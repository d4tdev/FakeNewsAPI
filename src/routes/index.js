const bookRoute = require('./news.route');

const routes = (app) => {
   app.use('/news', bookRoute);
}

module.exports = routes;
