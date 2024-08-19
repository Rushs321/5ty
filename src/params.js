const qDefault = 40;

function parseParams(req, res, next) {
    const { url, jpeg, bw, l } = req.query;
    if (!url) {
        return res.end('success');
    }
    req.params.url = decodeURIComponent(url);
    req.params.webp = !jpeg;
    req.params.grayscale = bw !== '0';
    req.params.quality = parseInt(l, 10) || qDefault;
    next();
}

module.exports = parseParams;
