import fs from 'fs'
import path from 'path'

export const topDirectory = path.resolve(process.env.DIR_LISTING_TOP_DIRECTORY || process.cwd())

export const isDirectory = (fpath) => {
    const fstat = fs.lstatSync(fpath)
    return fstat.isDirectory()
}

export const isSymlink = (fpath) => {
    const fstat = fs.lstatSync(fpath)
    return fstat.isSymbolicLink()
}

export const discoverFrom = (directory) => {
    const targets = fs.readdirSync(directory)
    const getHostPath = target => `${path.relative(topDirectory, directory) || "."}/${target}`
    const generateLink = target => {
        const isDir = isDirectory(`${directory}/${target}`)
        const isSym = isSymlink(`${directory}/${target}`)
        return ({
            hostPath: getHostPath(target),
            name: target,
            isDirectory: isDir,
            isSymlink: isSym,
            fileSize: fs.lstatSync(`${directory}/${target}`).size
        })
    }

    return targets.map(generateLink)
}


export const isSubDirectoryOfTop = (directory) => {
    return path.resolve(directory).startsWith(topDirectory)
}
