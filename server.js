const app = require('./src/app');
require('dotenv').config();

const port = process.env.PORT || 4090;
const server = app.listen(port, () =>
   console.log(
      `Server is running on  ${
         server.address().address === '::' ? `http://localhost` : server.address().address
      }:${server.address().port}`
   )
);

process.on('SIGINT', () => {
   server.close(() => {
      console.log(`Server closed!`);
      process.exit(0);
   });
});
