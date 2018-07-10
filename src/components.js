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
                       "teal-text text-lighten-2 item"
                      }
        >{link.name}{
                !link.isDirectory  && ` (${filesize(link.fileSize)})`
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
