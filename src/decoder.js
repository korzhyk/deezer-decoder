const Blowfish = require('egoroof-blowfish');
const md5 = require('blueimp-md5');

function xor(one, two, three) {
    let result = '';
    let i = 0;
    while (i < 16) {
        let char = one.charCodeAt(i);
        char ^= two.charCodeAt(i);
        char ^= three.charCodeAt(i);
        result += String.fromCharCode(char);
        i++;
    }
    return result;
}

function generateKey(songId) {
    const hash = md5(songId.toString());
    const firstMd5Half = hash.substr(0, 16);
    const secondMd5Half = hash.substr(16, 16);
    const salt = 'g4el58wc0zvf9na1';

    return xor(salt, firstMd5Half, secondMd5Half);
}

function decode(arrayBuffer, songId) {
    const source = new Uint8Array(arrayBuffer);
    const dest = new Uint8Array(source.length);
    const key = generateKey(songId);
    const intervalChunk = 3;
    const chunkSize = 2048;
    const chunkCount = Math.ceil(source.length / chunkSize);
    const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
    bf.setIv(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]));

    let i = 0;
    while (i < chunkCount) {
        const usedChunksSize = i * chunkSize;
        const currentChunkSize = Math.min(chunkSize, source.length - usedChunksSize);
        let buffer = source.subarray(usedChunksSize, usedChunksSize + currentChunkSize);
        if (i % intervalChunk === 0 && buffer.length === chunkSize) {
            buffer = bf.decode(buffer, Blowfish.TYPE.UINT8_ARRAY);
        }
        dest.set(buffer, usedChunksSize);
        i++;
    }
    return dest.buffer;
}

module.exports = decode;
