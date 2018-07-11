import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import {
    LinkList,
    Link,
    HeaderText
} from './components'
import {
    topDirectory,
    isDirectory,
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


const generatePage = (cwd, links) => (
    <html>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/css/materialize.min.css" />
            {generateStyle()}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
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

export const start = ({ onFinish }) => {
    const app = express()
    app.listen(process.env.DIR_LISTING_EXPOSED_PORT || 4455);
    app.get('/', (req, res) => {
        let thePath = topDirectory
        if (req.query.path) {
            thePath = `${topDirectory}/${req.query.path}`
        }
        thePath = path.resolve(thePath)
        console.log(thePath);

        if (!isSubDirectoryOfTop(thePath)) {
            res.status(403).send('Top Secret!')
            return
        }

        if (isDirectory(thePath)) {
            const links = discoverFrom(thePath)
            const asRelative = path.relative(topDirectory, thePath)
            res.send(renderToString(generatePage(`/${asRelative}`, links)))
        } else {
            res.download(thePath)
        }
    })
    process.on('exit', onFinish)
}

