const express = require('express');

var cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apartmentsRoutes = require('./routes/apartments-routes');
const managersRoutes=require('./routes/managers-routes');

const HttpError = require('./models/http-error');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/apartments', apartmentsRoutes); 
app.use('/api/managers', managersRoutes);


app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred.'});
});

mongoose
  .connect('mongodb+srv://meghnak:12345@apartment-water-management1-3rjlm.azure.mongodb.net/FluxGenAWM?retryWrites=true&w=majority')
  .then(()=>{
    
    app.listen(5000);
  })
  .catch(err =>{
    console.log(err);
  });

