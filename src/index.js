import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import { sortBy } from 'lodash'

const Link = ({ link }) => (
    <li>
        <a
            href={`/?path=${encodeURIComponent(link.hostPath)}`}
            className={link.isDirectory ? "red-text text-lighten-2" : "teal-text text-lighten-2"}
        >{link.name}</a>
    </li>
)

const LinkList = ({ children }) => {
    return (
        <ul>
            {children}
        </ul>
    )
}

const generateLinks = (links) => {
    return (
        <LinkList>
            {links.map(link => <Link key={link.hostPath} link={link} />)}
        </LinkList>
    )
}

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

const HeaderNavCrumb = ({ folder, link }) => (
    <a href={link} className="breadcrumb">{folder}</a>
)

const generateHeaderText = (cwd, links) => {
    const parts = cwd.split(path.sep).filter(k => !!k);
    const partsWithPath = parts.reduce((accumulator, curr) => {
        return accumulator.concat({
            name: curr,
            hostPath: `${accumulator[accumulator.length - 1].hostPath}/${curr}`
        })
    }, [{
        name: '/',
        hostPath: '/?path='
    }]);
    partsWithPath[0].hostPath = '/';
    let n = 0;

    return (
        <nav>
            <div className="nav-wrapper">
                <div className="col s12 top-header horizontal-scroll">
                    {partsWithPath.map(part => <HeaderNavCrumb key={`${n++}`} folder={part.name} link={part.hostPath} />)}
                </div>
            </div>
        </nav>
    )
}

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
                    {generateHeaderText(cwd, links)}
                </div>
                {generateLinks(sortBy(links, link => link.name))}
            </div>
        </body>
    </html>
)


const topDirectory = path.resolve(__dirname, '..')

const isDirectory = (fpath) => {
    const fstat = fs.lstatSync(fpath)
    return fstat.isDirectory()
}

const discoverFrom = (directory) => {
    const targets = fs.readdirSync(directory)
    const generateLink = target => ({
        hostPath: `${path.relative(topDirectory, directory) || "."}/${target}`,
        name: target,
        isDirectory: isDirectory(`${directory}/${target}`)
    })

    return targets.map(generateLink)
}

const app = express()
app.listen(3000)
app.get('/', (req, res) => {
    let thePath = topDirectory
    if (req.query.path) {
        thePath = `${topDirectory}/${req.query.path}`
    }
    thePath = path.resolve(thePath)

    if (!thePath.startsWith(topDirectory)) {
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

app.get('/')
