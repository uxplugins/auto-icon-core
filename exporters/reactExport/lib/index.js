import React from "react";
import ReactHtmlParser from 'react-html-parser';
import { stringify } from "svgson";

const Cmp = (props) => {
    return ReactHtmlParser(stringify(props.svg));
}

export const GenReact = (svg) => {
    return <Cmp svg={svg}/>
}