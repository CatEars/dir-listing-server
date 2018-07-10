import fs from 'fs'
import path from 'path'

export const topDirectory = path.resolve(process.env.DIR_LISTING_TOP_DIRECTORY || process.cwd())

export const isDirectory = (fpath) => {
    const fstat = fs.lstatSync(fpath)
    return fstat.isDirectory()
}

export const discoverFrom = (directory) => {
    const targets = fs.readdirSync(directory)
    const getHostPath = target => `${path.relative(topDirectory, directory) || "."}/${target}`
    const generateLink = target => ({
        hostPath: getHostPath(target),
        name: target,
        isDirectory: isDirectory(`${directory}/${target}`)
    })

    return targets.map(generateLink)
}


export const isSubDirectoryOfTop = (directory) => {
    return path.resolve(directory).startsWith(topDirectory)
}
