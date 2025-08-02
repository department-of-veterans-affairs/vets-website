export default AppConfig;
declare function AppConfig({ children, setDatadogRumUserFn, useDatadogRumFn, }: {
    children: any;
    setDatadogRumUserFn?: any;
    useDatadogRumFn?: any;
}): React.JSX.Element;
declare namespace AppConfig {
    namespace propTypes {
        let children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        let setDatadogRumUserFn: PropTypes.Requireable<(...args: any[]) => any>;
        let useDatadogRumFn: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
