const imgProc = require('sharp');
const redirectFunc = require('./redirect');

function compressImg(req, res, imgData) {
    const imgFormat = req.params.webp ? 'webp' : 'jpeg';
    imgProc(imgData)
        .grayscale(req.params.grayscale)
        .toFormat(imgFormat, { quality: req.params.quality, progressive: true, optimizeScans: true })
        .toBuffer((error, outputBuffer, info) => {
            if (error || !info || res.headersSent) {
                return redirectFunc(req, res);
            }
            res.setHeader('content-type', `image/${imgFormat}`);
            res.setHeader('content-length', info.size);
            res.setHeader('x-original-size', req.params.originSize);
            res.setHeader('x-bytes-saved', req.params.originSize - info.size);
            res.status(200).send(outputBuffer);
        });
}

module.exports = compressImg;
