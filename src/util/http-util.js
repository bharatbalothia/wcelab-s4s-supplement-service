const Constants = require('./constants')
// const Promise = require('promise')

module.exports = {

    getIVHttpOptions: (urlPath, bearerToken, httpMethod, requestParameters, jsonInput) => {
        var authorizationHeader = "Bearer " + bearerToken
        var options = {
            method: httpMethod,
            uri: urlPath,
            qs: requestParameters ? requestParameters : null,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorizationHeader
            },
            json: true,
            body: httpMethod == "GET" ? null : jsonInput
        };

        return options;
    },

    getIVApiPromise: (urlPath, bearerToken, httpMethod, requestParameters, jsonInput) => {

        option = getIVHttpOptions(urlPath, bearerToken, httpMethod, requestParameters, jsonInput)

        return requestWithRetry(option, Constants.IV_API_FAIL_TOKEN_RETRY_ATTEMPT, 1)
    },
}

// Get a promise for a http request. 
function requestWithRetry(requestOption, retryCount, currentTries) {

    return new Promise((resolve, reject) => {

        const timeout = (Math.pow(2, currentTries) - 1) * 100;
        
        RequestPromise(requestOption)
            .then(resolve)
            .catch((error) => {
                if (currentTries <= retryCount) {
                    setTimeout(() => {
                        console.log('Error: ', error);
                        console.log(`Waiting ${timeout} ms`);
                        requestWithRetry(requestOption, retryCount, currentTries + 1);
                    }, timeout);
                } else {
                    reject(error)
                }
            });
    });
}