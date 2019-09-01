const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//TO-DO retrieve real urls
const urls = [
    {
        id: 1,
        url: 'https://vs1.coursehunter.net/lavrik-js-for-frontend-dev/lesson1.mp4'
    },
    {
        id: 2,
        url: 'https://vs1.coursehunter.net/lavrik-js-for-frontend-dev/lesson2.mp4'
    },
    {
        id: 3,
        url: 'https://vs1.coursehunter.net/lavrik-js-for-frontend-dev/lesson3.mp4'
    }];


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/urls', (req, res) => {
    return res.json({success: true, urls});
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));