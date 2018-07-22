import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import {
    LinkList,
    Link,
    HeaderText,
    ErrorCards
} from './components'
import {
    topDirectory,
    isDirectory,
    isSymlink,
    discoverFrom,
    isSubDirectoryOfTop
} from './fileSystem'

const generateStyle = (() => {
    const stylePath = path.resolve(__dirname, 'style.css')
    let styleStr = ''
    try {
        styleStr = fs.readFileSync(stylePath, { encoding: 'utf-8' })
    } catch(err) {
        console.log('Could not load the stylesheet :/, deploying empty style')
    }

    return () => {
        return <style dangerouslySetInnerHTML={{__html: styleStr}}></style>
    }

})()


const generateHead = () => (
    <head>
        <link rel="stylesheet"
              href="https://use.fontawesome.com/releases/v5.1.1/css/all.css"
              integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ"
              crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/css/materialize.min.css" />
        {generateStyle()}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
)

const generatePage = (cwd, links) => (
    <html>
        {generateHead()}
        <body>
            <div className="root container">
                <div className="header">
                    <HeaderText cwd={cwd} links={links} />
                </div>
                <LinkList>
                    {links.map(link => <Link key={link.hostPath} link={link} />)}
                </LinkList>
            </div>
        </body>
    </html>
)

const generateError = () => (
    <html>
        {generateHead()}
        <body>
            <div className="root container">
                <p>This is the error page. you have probably encountered an error. If you are a site administrator you should check the logs. Otherwise you can look at some of the know errors listed below.</p>
                <ErrorCards />
            </div>
        </body>
    </html>
)

export const start = ({ onFinish }) => {
    const app = express()
    app.listen(process.env.DIR_LISTING_EXPOSED_PORT || 4455);
    app.get('/', (req, res) => {
        try {
            let thePath = topDirectory
            if (req.query.path) {
                thePath = `${topDirectory}/${req.query.path}`
            }

            thePath = path.resolve(fs.realpathSync(thePath))

            if (!isSubDirectoryOfTop(thePath)) {
                res.status(403).send('Top Secret!')
                return
            }


            if (isDirectory(thePath) || isSymlink(thePath)) {
                const links = discoverFrom(thePath)
                const asRelative = path.relative(topDirectory, thePath)
                res.send(renderToString(generatePage(`/${asRelative}`, links)))
            } else {
                res.download(thePath)
            }
        } catch (err) {
            console.error(err)
            res.status(500).send(renderToString(generateError()))
        }
    })
    process.on('exit', onFinish)
}


if (require.main === module) {
    start({ onFinish: () => {} });
}
