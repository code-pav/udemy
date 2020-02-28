const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const dbConnect = process.env.DB
  .replace('<PASSWORD>', process.env.DB_PASSWORD)
  .replace('<USERNAME>', process.env.DB_USER);

mongoose
  .connect(dbConnect,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  .then(() => {
    console.log('Connection to db successful.')
  });


const app = require('./src/app');

const PORT = process.env.PORT || 3333;
const server = app.listen(PORT, () => {
  console.log(`Server listen on port: ${ PORT }`)
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
