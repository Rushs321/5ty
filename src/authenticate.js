const k1 = require('basic-auth');
const g1 = process.env.LOGIN;
const g2 = process.env.PASSWORD;

function xq(req, res, cb) {
    if (g1 && g2) {
        const authCredentials = k1(req);
        if (!authCredentials || authCredentials.name !== g1 || authCredentials.pass !== g2) {
            res.setHeader('WWW-Authenticate', `Basic realm="Bandwidth-Hero Compression Service"`);
            return res.status(401).end('Access denied');
        }
    }
    cb();
}

module.exports = xq;
