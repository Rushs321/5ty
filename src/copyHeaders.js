function headerCopy(srcHeaders, tgtResponse) {
    for (const [headerKey, headerValue] of Object.entries(srcHeaders.headers)) {
        try {
            tgtResponse.setHeader(headerKey, headerValue);
        } catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = headerCopy;
