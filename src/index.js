import path from 'path';
import fs from 'fs';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { cond } from 'lodash';

const Link = ({ link }) => <li><a href={`/?path=${encodeURIComponent(link.hostPath)}`}>{link.name}</a></li>;

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
    const stylePath = path.resolve(__dirname, 'style.css');
    let styleStr = '';
    try {
        styleStr = fs.readFileSync(stylePath, { encoding: 'utf-8' });
    } catch(err) {
        console.log('Could not load the stylesheet :/, deploying empty style');
    }

    return () => {
        return <style>{styleStr}</style>;
    }

})()

const generatePage = (links) => {
    return (
        <html>
            <head>
                {generateStyle()}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <div className="root">
                    {generateLinks(links)}
                </div>
            </body>
        </html>
    );
}

const topDirectory = path.resolve(__dirname, '..');

const isDirectory = (fpath) => {
    const fstat = fs.lstatSync(fpath);
    return fstat.isDirectory();
}

const discoverFrom = (directory) => {
    const targets = fs.readdirSync(directory);
    const generateLink = target => ({
        hostPath: `${path.relative(topDirectory, directory) || "."}/${target}`,
        name: target,
        isDirectory: isDirectory(`${directory}/${target}`)
    });

    const prelinks = [];
    if (path.relative(topDirectory, directory)) {
        // If this is not the topmost directory
        prelinks.push(generateLink('..'));
    }

    return prelinks.concat(targets.map(generateLink));
}

const app = express();
app.listen(3000);
app.get('/', (req, res) => {
    let thePath = topDirectory;
    if (req.query.path) {
        thePath = `${topDirectory}/${req.query.path}`
    }
    thePath = path.resolve(thePath);
    console.log('The path:', thePath);

    if (!thePath.startsWith(topDirectory)) {
        res.status(403).send('Top Secret!');
        return;
    }

    if (isDirectory(thePath)) {
        const links = discoverFrom(thePath);
        res.send(renderToString(generatePage(links)));
    } else {
        res.download(thePath);
    }
})

app.get('/')
