import React from 'react'
import { sep as separator } from 'path'
import filesize from 'filesize'

export const Link = ({ link }) => (
    <li>
        <a
            href={`/?path=${encodeURIComponent(link.hostPath)}`}
            className={
                link.isDirectory ?
                       "red-text text-lighten-2 directory" :
                       link.isSymlink ?
                       "blue-text text-lighten-2 symlink" :
                       "teal-text text-lighten-2 item"
                      }
        >{link.name}{
                !link.isDirectory && !link.isSymlink  && ` (${filesize(link.fileSize)})`
         }</a>
    </li>
)

export const LinkList = ({ children }) => {
    return (
        <ul className="horizontal-scroll">
            {children}
        </ul>
    )
}


export const HeaderNavCrumb = ({ folder, link }) => (
    <a href={link}
       className={
           folder ?
                  "breadcrumb" :
                  "breadcrumb homelink"
                 }>{folder}</a>
)


export const HeaderText = ({cwd, links}) => {
    const parts = cwd.split(separator).filter(k => !!k)
    const partsWithPath = parts.reduce((accumulator, curr) => {
        return accumulator.concat({
            name: curr,
            hostPath: `${accumulator[accumulator.length - 1].hostPath}/${curr}`
        })
    }, [{
        name: '',
        hostPath: '/?path='
    }])
    partsWithPath[0].hostPath = '/'
    let n = 0

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

const goBackString = `<a href="#" onclick="window.history.back();">Go Back</a>`

export const ErrorCards = () => (
    <div className="row">
        <div className="col s12 m6">
            <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                    <span className="card-title">
                        Symlinks on remote hosts
                    </span>
                    <p>
                        Following a symlink on a remote machine (such as through sshfs) is not possible. The remote link does not redirect well, unfortunately. If you need to work with a lot of symlinks, then I am afraid this is not the package for you! If you are using SSHFS then symlinks are perhaps neither the correct choice for you.
                    </p>
                </div>
            </div>
            <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                    <span className="card-title">
                        Permission Errors
                    </span>
                    <p>
                        If you can read the existence of a folder but do not have the permission to read inside it you might encounter problems when trying to enter that folder. Similar problems can occur if you try to download a file which you can see exists, but not access. For example /etc/shadow.
                    </p>
                </div>
                <div className="card-action" dangerouslySetInnerHTML={{__html: goBackString}}>
                </div>
            </div>
        </div>
    </div>

)
