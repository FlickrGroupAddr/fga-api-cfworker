import { FlickrApiCloudflareWorker } from './flickrapi-cfworker';

export async function getFlickrPermsUrl() {
    const flickrApi = new FlickrApiCloudflareWorker( FGA_FLICKR_APP_KEY, 
        FGA_FLICKR_APP_KEY_SECRET );

    const permsGrantedCallback = "https://cfapi.flickrgroupaddr.com/api/v002/flickr_perms_granted_callback";

    const flickrRequestTokenInfo = await flickrApi.getRequestTokenInfo( permsGrantedCallback );

    /*
    const response = new Response( JSON.stringify(flickrRequestTokenInfo, false, 4) + "\n",
        {
            headers: new Headers(
                {
                    'Content-Type'                          : 'application/json',

                    // CORS header needed
                    'Access-Control-Allow-Origin'           : 'https://cf.dev.flickrgroupaddr.com',
                    'Access-Control-Allow-Credentials'      : 'true',
                }
            )
        }
    );
    */



    const permissionLevel = 'write';

    const authUrl = flickrApi.authUrl( permissionLevel );

    responseBody = {
        'auth_url'  : authUrl,
    }

    const response = new Response( JSON.stringify(responseBody, false, 4) + "\n",
        {
            headers: new Headers(
                {
                    'Content-Type'                          : 'application/json',

                    // CORS header needed
                    'Access-Control-Allow-Origin'           : 'https://cf.dev.flickrgroupaddr.com',
                    'Access-Control-Allow-Credentials'      : 'true',
                }
            )
        }
    );
    */

    return response;
}
