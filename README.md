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
as a webserver. Additionally we also use react to create a server-side
rendering of the index. The result is that no javascript is used
(okay, it is used in like one place to go back to the previous page,
but ya know) and the page can easily be crawled by both a human and a
machine.

[!What it looks like](https://i.imgur.com/8wdgFCW.png)
