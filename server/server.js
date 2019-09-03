const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const numeral = require('numeral');
const https = require('https');
const fs = require('fs');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const urlRetriever = require('./util/url-retriever');
const request = require('superagent');
// require('superagent-proxy')(request);
// const proxy = 'http://127.0.0.1:8080';

const JSSoup = require('jssoup').default;

const parse =  require('node-html-parser').parse;


const CONTENT_URL_PATTERN = /<link href="(.+?)" itemprop="contentUrl"\/>/g;
const CONTENT_DESCRIPTION_PATTERN = /<meta itemprop="description" content="(.+?)"\/>/g;


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));


router.get('/urls', async (req, res) => {
    const {email = '123', password = '321', url, out} = req.query;
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
    console.log(`url: ${url}`);
    console.log(`out: ${out}`);

    let urls = null;
    if (!email || !password) {
        // free course
        request
            .get('/some-url')
            .end((res) => {
                console.log("res: below");
                console.log(res)
            });

    } else {
        urls = await downloadPremiumCourse(req.query);
    }


    return res.json({success: true, urls});
});

async function downloadPremiumCourse(query) {
    const {email, password, url, out} = query;
    const agent = request.agent();
    return await agent
        .post('https://coursehunter.net/sign-in')
        // .proxy(proxy)
        .set('Content-Type', 'application/json')
        .send(`{"e_mail":"${email}","password":"${password}"}`)
        .then(() => {
            return agent.get(url);
        })
        .then(async res => {
            urls = [];

            const urlMatches = res.text.matchAll(CONTENT_URL_PATTERN);
            const descriptionMatches = res.text.matchAll(CONTENT_DESCRIPTION_PATTERN);

            let index = 1;
            for (const match of urlMatches) {
                urls.push({
                    id: index,
                    url: match[1]
                });
                index++;
            }

            index = 0;
            for (const match of descriptionMatches) {
                const urlObj = urls[index];
                urlObj.description = match[1];

                const ext = path.extname(urlObj.url);
                const description = urlObj.description.replace(/\//g, '_');
                const fileName = numeral(urlObj.id).format('0'.repeat((urls.length + '').length + 1)) + '. ' + description + ext;
                urlObj.localPath = path.join(out, fileName);

                index++;
            }

            for (let i = 0; i< urls.length; i++) {
                const urlObj = urls[i];
                await makeSynchronousRequest(urlObj);
            }



            return urls;
        });
}

function getPromise(urlObj) {
    return new Promise((resolve, reject) => {

        https.get(urlObj.url, function(res) {
            const file = fs.createWriteStream(urlObj.localPath);

            res.on('data', function(data) {
                file.write(data);
            }).on('end', function() {
                file.end();
                resolve("Downloaded to: " + urlObj.localPath);
            }).on('error', (error) => {
                reject(error);
            });
        });
    });
}

async function makeSynchronousRequest(urlObj) {
    try {
        console.log("Creating promise for : " + urlObj.url);
        let http_promise = getPromise(urlObj);
        let response_body = await http_promise;

        // holds response from server that is passed when Promise is resolved
        console.log(response_body);
    }
    catch(error) {
        // Promise rejected
        console.error(error);
    }
}

app.use('/api', router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));