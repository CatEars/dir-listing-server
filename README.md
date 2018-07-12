# dir-listing-server

A webserver built for serving a fancier directory listing together
with the capacity to download individual files from it.

The urge to create this came from using nginx for autoindexing
files. If you've used this you know it works really well, but it
creates something that looks rather ugly and is not superfriendly for
a human to navigate. The goal of dir-listing-server is to create a
local webserver which does the same thing as autoindex in nginx, but
also makes it quite navigable and looks a bit better than just plain
HTML.

We use [materializecss](https://materializecss.com/) to make
everything look good and utilize [express.js](https://expressjs.com/)
as a webserver. Additionally we also use [react](https://reactjs.org/)
to create a server-side rendering of the index. The result is that no
javascript is used (okay, it is used in like one place to go back to
the previous page, but ya know) and the page can easily be crawled by
both a human and a machine.

# Screenshots

Desktop:

![What it looks like](https://i.imgur.com/8wdgFCW.png)

Mobile:

![What it looks like on mobile](https://i.imgur.com/LhHZIK9.png)


# Deployment

Example script for deploying (includes all available parameters):

```javascript
import { start } from 'dir-listing-server'

console.log(`Deploying index server at ${DIR_LISTING_TOP_DIRECTORY}`)
console.log(`Using port: ${DIR_LISTING_EXPOSED_PORT}`)

start({
    onFinish: () => {}
})

```

# Deployment with Dockerfile

The included `Dockerfile` builds a docker image which can serve from
within the container. If you want to put the index server within
something like a Docker Swarm then I would suggest you add a volume to
the container and serve that volume with for example

`docker run --env DIR_LISTING_TOP_DIRECTORY=/root/served --volume /path/to/my/directory:/root/served -p 4455:4455 dir-listing`

I personally use this with
[sshfs](https://en.wikipedia.org/wiki/SSHFS) to view and browse
several directories and files from the same webpage.
