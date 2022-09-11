export class OAuth1CloudflareWorker {
    #consumerKey = null;
    #consumerSecret = null;
    #signatureMethod = null;
    #hashFunction = null;

    constructor( consumerKey, consumerSecret, signatureMethod, hashFunction ) {
        this.#consumerKey = consumerKey;
        this.#consumerSecret = consumerSecret;
        this.#signatureMethod = signatureMethod;
        this.#hashFunction = hashFunction;
    }

}
