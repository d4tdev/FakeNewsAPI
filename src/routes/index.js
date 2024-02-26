const bookRoute = require('./news.route');

const routes = (app) => {
   app.use('/books', bookRoute);
}

module.exports = routes;
