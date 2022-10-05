require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const questionsRoute = require('./routes/question.route');
const estimationRoute = require('./routes/estimation.route');
const PORT = process.env.PORT || 3001;
const errorMiddleware = require('./middleware/error-middleware')

const app = express();
app.use( cors() );
app.use( express.urlencoded({ extended : true }));
app.use( express.json() );
app.use('/questions', questionsRoute);
app.use('/estimation', estimationRoute);
app.use( errorMiddleware )

app.get('/', (req, res) => {
  res.json('Ok')
})


const start = (async () => {
  try {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`)
    })
  } catch (err) {
    console.log(err.message);
  }
})();

