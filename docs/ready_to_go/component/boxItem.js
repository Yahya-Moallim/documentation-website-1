import React from 'react'
import styles from  './styles.module.css'


function BoxItem({src,title,link}) {
    console.log(src)
  return (
    <a className={styles.link} href={link} target='_blank'>
        <div className={styles.box}>
            <div className={styles.box__img}>
                <img style={{display:'inline-block'}} src ={src} alt={`logo of ${title}`}></img>
            </div>
            <h4>{title}</h4>
        </div>
    </a>
  )
}

export default BoxItem