const bookRoute = require('./book.route');

const routes = (app) => {
   app.use('/books', bookRoute);
}

module.exports = routes;
