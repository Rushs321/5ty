const qDefault = 40;

function parseParams(req, res, next) {
    const { url, jpeg, bw, l } = req.query;
    if (!url) {
        return res.end('bandwidth-hero-proxy');
    }
    const urlString = Array.isArray(url) ? url.join('&url=') : url;
    const sanitizedUrl = urlString.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');
    req.params.url = sanitizedUrl;
    req.params.webp = !jpeg;
    req.params.grayscale = bw !== '0';
    req.params.quality = parseInt(l, 10) || qDefault;
    next();
}

module.exports = parseParams;
