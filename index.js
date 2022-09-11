import { Router } from 'itty-router'
import {  getFlickrPermsUrl } from './getFlickrPermsUrl';

// Create a new router
const router = Router()

router.get("/api/v002/flickr_permissions_url", getFlickrPermsUrl )


/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!\n", { status: 404 }))

/*
This snippet ties our worker to the router we defined above; all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
