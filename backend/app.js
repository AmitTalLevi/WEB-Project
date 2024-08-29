require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const tripRoutes = require('./routes/trip');
const imageRoutes = require('./routes/generateImage');
const historyRoutes = require('./routes/history'); 

const app = express();

const dbUrl = 'mongodb://localhost:27017/TravelAppDB'; 
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use(cors({
  origin: 'http://localhost:3000' 
}));

app.use(bodyParser.json());

// Routes
app.use('/api/trips', tripRoutes);
app.use('/api/generate-image', imageRoutes);
app.use('/api/history', historyRoutes); 

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
