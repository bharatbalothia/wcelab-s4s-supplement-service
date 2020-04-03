module.exports = {
    encode: (value) => {
        var encodedString = Buffer.from(value).toString('base64');
        // console.log(encodedString);
        return encodedString;
    }
}
