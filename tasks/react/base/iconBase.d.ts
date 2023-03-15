import * as React from 'react';
export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    attr?: React.SVGAttributes<SVGElement>;
    width?: string
}
export declare type IconType = (props: IconBaseProps) => JSX.Element;

