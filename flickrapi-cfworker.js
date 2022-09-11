import jsSHA from "jssha";

export class FlickrApiCloudflareWorker {
    #appKey = null;
    #appKeySecret = null;
    #oauthSignatureMethod = "HMAC-SHA1";

    constructor( appKey, appKeySecret ) {
        this.#appKey = appKey;
        this.#appKeySecret = appKeySecret;
    }

    async getRequestTokenInfo( permsGrantedCallbackUrl ) {
        const oauthTimestamp = Math.round((new Date()).getTime() / 1000.0);

        let integerArray = new Uint32Array(1)
        crypto.getRandomValues( integerArray )

        let oauthNonce = crypto.randomUUID()

        // NOTE! The parameters are not in a random order. They have to be in lexigraphical order, hence why _callback
        //      is first, and _version is last. regardless of order in the request, the signature will be repeatable
        const baseStringComponents = [
            "GET",

            "https://www.flickr.com/services/oauth/request_token",

            "oauth_callback=" + encodeURIComponent( permsGrantedCallbackUrl ) +
            "&oauth_consumer_key=" + this.#appKey + 
            "&oauth_nonce=" + oauthNonce +
            "&oauth_signature_method=" + this.#oauthSignatureMethod + 
            "&oauth_timestamp=" + oauthTimestamp +
            "&oauth_version=1.0"
        ];

        let encodedBaseString = "";

        for ( let currComponent of baseStringComponents ) {
            encodedBaseString += encodeURIComponent( currComponent ) + "&"
        }

        // Trim off last ampsersand
        encodedBaseString = encodedBaseString.substring(0, encodedBaseString.length - 1);

        // Sign the request

        // Key used for signing is "<consumer secret>&<token secret>"
        //      At this phase, we don't yet have a token secret, so it just stays blank and we use our secret
        //      followed by an ampsersand
        const requestSigningKey = encodeURIComponent(this.#appKeySecret) + "&"

        const shaObj = new jsSHA( "SHA-1", "TEXT",
            {
                hmacKey: {
                    value: requestSigningKey,
                    format: "TEXT"
                },
            } )

        shaObj.update( encodedBaseString )
        const signature = shaObj.getHash( "B64" )

        // Ready to make the request, I think?
        const urlToRequest = "https://www.flickr.com/services/oauth/request_token" +
            "?oauth_nonce=" + encodeURIComponent(oauthNonce) +
            "&oauth_timestamp=" + encodeURIComponent(oauthTimestamp) +
            "&oauth_consumer_key=" + encodeURIComponent(this.#appKey) +
            "&oauth_signature_method=" + encodeURIComponent(this.#oauthSignatureMethod) +
            "&oauth_version=" + encodeURIComponent("1.0") +
            "&oauth_signature=" + encodeURIComponent( signature ) +
            "&oauth_callback=" + encodeURIComponent(permsGrantedCallbackUrl );

        const tokenRequestResponse = await fetch( urlToRequest )

        const responseText = await tokenRequestResponse.text()

        const responseTokens = responseText.split( '&' )

        let responseDictionary = {}

        for ( const currToken of responseTokens ) {
            const responsePair = currToken.split("=")

            responseDictionary[ responsePair[0] ] = responsePair[ 1 ]
        }

        const encodedToken = encodeURIComponent( responseDictionary['oauth_token'] )
        const encodedTokenSecret = encodeURIComponent( responseDictionary['oauth_token_secret'] )

        const requestTokenInfo = {
            'request_token_info': {
                'auth_token'        : encodedToken,
                'auth_token_secret' : encodedTokenSecret
            }

        }

        return requestTokenInfo;
    }

    getAuthUrl(permissionsGrantedCallbackUrl, permissionsLevel) {
        return "https://flickr.com/some/auth/url";
    }
}
