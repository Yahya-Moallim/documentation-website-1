import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';

export default function Circle ({children, color,marg}) {
    const {siteConfig,siteMetadata} = useDocusaurusContext();
    const {colorMode, setColorMode } = useColorMode();
    // const [textColor,setTextColor] = React.useContext('black')
    console.log(siteConfig.themeConfig.colorMode)
    return(
        <span style={{
            backgroundColor:color,
            borderRadius:'50%',
            width:'28px',
            height:'28px',
            fontSize:'.6em',
            color: `${colorMode === 'dark'? 'white': 'black'}`,
            backgroundColor:'grey',
            padding:'.4rem',
            marginBottom:`.7rem`,
            textAlign:'center',
            display:'inline-block',
            // display:'flex',
            // justifyContent:'center',
            // alignItems:'center',
        }}>
            {children}
        </span>
    )
}