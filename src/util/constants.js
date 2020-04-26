module.exports = {
    IV_API_BASE_URL: 'https://api.watsoncommerce.ibm.com/inventory/{tenantId}/v1/{operation}',
    IV_AUTH_TOKEN_BASE_URL: 'https://api.watsoncommerce.ibm.com/inventory/{tenantId}/v1/oauth2/token',
    IV_AUTH_TOKEN_CONTENT_TYPE: 'application/x-www-form-urlencoded',
    IV_AUTH_TOKEN_BODY: 'grant_type=client_credentials',
    IV_AUTH_TOKEN_TTL_SAFETY_BUFFER: 30,
    IV_API_FAIL_TOKEN_RETRY_ATTEMPT: 3,
}