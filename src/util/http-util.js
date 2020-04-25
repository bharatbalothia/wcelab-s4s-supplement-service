module.exports = {

    getIVHttpOptions: (urlPath, bearerToken, httpMethod, requestParameters, jsonInput) => {
        var authorizationHeader = "Bearer " +  bearerToken
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
    

}