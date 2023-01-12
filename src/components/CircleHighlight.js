import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';

export default function Circle ({children, text , width}) {
    const {siteConfig,siteMetadata} = useDocusaurusContext();
    const {colorMode, setColorMode } = useColorMode();
    // const [textColor,setTextColor] = React.useContext('black')
    let co = colorMode === 'dark' ? 'white' : 'black' ; 
    console.log(siteConfig.themeConfig.colorMode)
    return(
    <span style={{display:'inline-block',position:'relative',marginRight:'.6rem'}}>
        {text}
        <div style={{position:'absolute', top:0 , left:0,transform:'translate(-18%, -19%)'}}>
            <svg class="sv" version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1185 410" width={width} height="50">
                <title>&lt;Circled_sketch&gt;</title>
                <path id="&lt;Circled_sketch&gt;" fill-rule="evenodd" fill={co} class="s0" d="m149 115.6c-49.1 16.2-114 33.8-131.7 81.7-13.1 35.7 9.2 77.9 21.7 98.3-17.7-23.8-51.5-69.2-33.3-118.3 7.6-20.7 32.1-44.2 53.3-56.7 70.1-41.2 179.9-55.2 268.3-81.6 160.5-48 381.9-55.1 531.7 1.6 20.5 7.8 39.8 18.7 61.7 25 90.6 26 185.1 50.4 236.6 113.4 13.2 16 26.6 42.9 26.7 68.3 0.3 48.3-31 76.4-63.3 95-52.9 30.4-129.8 46.9-220 56.7-155.4 16.8-369.8 11.6-525-3.4-116.4-11.2-230-26.4-285-91.6-21.7-25.7-34.5-70.9-18.4-108.4 15.4-35.8 42.2-52 76.7-80zm768.3-16.7c-20.9-8.8-55.4-13.4-86.6-18.3-56.2-8.8-118.3-15.5-178.4-18.3-35.7-1.7-71.2-4.7-96.6-1.7-83.3 10-181.9 1.4-253.4 21.7-36.8 10.4-65.8 25.3-95 40-51.5 25.9-155.4 90-90 163.3 43 48.1 137.2 66.9 223.4 76.7 174.6 19.8 390 28.7 570 6.7 78.4-9.6 184.8-27.9 225-75 24.5-28.9 18.1-71.8-3.4-96.7-32.6-37.9-98.9-63.1-146.6-81.7-2.5 5.8 4.7 11.4 8.3 16.7 29.8 44.3 37.8 118.8-18.3 138.3 62.4-59.4 0.6-146.6-58.4-171.7z"/>
                <text x="190" y="250" class="text">{text}</text>
            </svg>
        </div>
    </span>
    )
}