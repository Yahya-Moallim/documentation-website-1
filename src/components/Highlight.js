import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';

export default function Highlight ({children, color}) {
    const {siteConfig,siteMetadata} = useDocusaurusContext();
    const {colorMode, setColorMode } = useColorMode();
    // const [textColor,setTextColor] = React.useContext('black')
    console.log(siteConfig.themeConfig.colorMode)
    return(
        <span style={{
            backgroundColor:color,
            borderRadius:'5px',
            color: `${colorMode === 'dark'? 'white': 'black'}`,
            padding:'.3rem',
            marginBottom:'2px',
            display:'inline-block'
        }}>
            {children} 🤯🤯
        </span>
    )
}