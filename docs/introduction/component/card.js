import React from 'react';
import styles from './styles.module.css';
import Api from './assets/api.svg'
import Plugin from './assets/plugin.svg'

function Card({text,link,type}) {
  return (
    <div className={styles.ca}>
      <div className={styles.ca_img_container}>
        <a className={styles.a} href={link}>
          {
            type === 'api' && <Api className={styles.sv}/>
          }
          {
            type === 'plugin' && <Plugin className={styles.sv}/>
          }
          {
            type === 'integration' && <Plugin className={styles.sv}/>
          }
        </a>
      </div>
      <p className={styles.ca_text}>
          {text}
        </p>
    </div>
  )
}

export default Card