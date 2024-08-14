function zl(req, res, imgBuffer) {
    res.setHeader('x-proxy-bypass', 1);
    res.setHeader('content-length', imgBuffer.length);
    res.status(200).send(imgBuffer);
}

module.exports = zl;
