export function getFlickrAuthUrl() {
    const flickrAuthResponse = {
        "flickr_auth_url": "https://flickr.com/somethingorother"
    }
    return new Response( JSON.stringify(flickrAuthResponse) )
}
