const httpRequest = require('request');
const objPick = require('lodash').pick;
const shouldCompressImg = require('./shouldCompress');
const redirectFunc = require('./redirect');
const compressImg = require('./compress');
const bypassFunc = require('./bypass');
const headerCopy = require('./copyHeaders');

// Arrays to hold randomized user agents and IP addresses
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36'
];

const randomIPs = [
    '192.168.1.1',
    '10.0.0.1',
    '172.16.0.1',
    '202.54.1.1',
    '198.51.100.1'
];

// Function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

function proxyRequest(req, res) {
    const randomUserAgent = getRandomElement(userAgents);
    const randomIP = getRandomElement(randomIPs);

    httpRequest.get(req.params.url, {
        headers: {
            ...objPick(req.headers, ['cookie', 'dnt', 'referer']),
            'user-agent': randomUserAgent,
            'x-forwarded-for': randomIP
        },
        timeout: 10000,
        maxRedirects: 5,
        encoding: null,
        strictSSL: false,
        gzip: true,
        jar: true
    }, (error, originResponse, imgBuffer) => {
        if (error || originResponse.statusCode >= 400) {
            return redirectFunc(req, res);
        }
        headerCopy(originResponse, res);
        res.setHeader('content-encoding', 'identity');
        req.params.originType = originResponse.headers['content-type'] || '';
        req.params.originSize = imgBuffer.length;
        if (shouldCompressImg(req)) {
            compressImg(req, res, imgBuffer);
        } else {
            bypassFunc(req, res, imgBuffer);
        }
    });
}

module.exports = proxyRequest;
