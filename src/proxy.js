const httpRequest = require('request');
const objPick = require('lodash').pick;
const shouldCompressImg = require('./shouldCompress');
const redirectFunc = require('./redirect');
const compressImg = require('./compress');
const bypassFunc = require('./bypass');
const headerCopy = require('./copyHeaders');

function proxyRequest(req, res) {
    httpRequest.get(req.params.url, {
        headers: {
            ...objPick(req.headers, ['cookie', 'dnt', 'referer']),
            'user-agent': 'Bandwidth-Hero Compressor',
            'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
            via: '1.1 bandwidth-hero'
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
