module.exports = {
    encode: (value) => {
        var encodedString = Buffer.from(value).toString('base64');
        return encodedString;
    },
    decode: (value) => {
        var decodedString = Buffer.from(value, 'base64').toString('ascii');
        return decodedString;
    }
}
