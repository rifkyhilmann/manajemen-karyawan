const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const PORT = 1000
const router = require('./router');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})