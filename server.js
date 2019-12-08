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
  })
  .catch((err) => {
    console.log('Cannot connect to db', err)
  });


//
// const testTour = new Tour({ name: 'The Forest Hiker', rating: 4.7, price: 497 });
//
// testTour
//   .save()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err)=> {
//     console.log('error', err.errmsg)
//   });

const app = require('./src/app');

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server listen on port: ${ PORT }`)
});
