const minCompressSize = 512; 
const transparentCompressThreshold = minCompressSize * 100;

function isCompressionNeeded(req) {
    const { originType, originSize, webp } = req.params;
    if (!originType.startsWith('image')) {
        return false;
    }
    if (originSize === 0) {
        return false;
    }
    if (webp && originSize < minCompressSize) {
        return false;
    }
    if (!webp && (originType.endsWith('png') || originType.endsWith('gif')) && originSize < transparentCompressThreshold) {
        return false;
    }
    return true;
}

module.exports = isCompressionNeeded;
