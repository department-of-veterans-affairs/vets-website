export default ErrorBoundary;
declare class ErrorBoundary extends React.Component<any, any, any> {
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    constructor(props: any);
    state: {
        hasError: boolean;
    };
    componentDidCatch(_error: any): void;
    render(): React.JSX.Element;
}
declare namespace ErrorBoundary {
    namespace propTypes {
        let children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        let isPreCheckIn: PropTypes.Requireable<boolean>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
