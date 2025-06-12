export default AlertNotVerified;
declare function AlertNotVerified({ cspId, recordEvent }: {
    cspId: any;
    recordEvent: any;
}): React.JSX.Element;
declare namespace AlertNotVerified {
    namespace defaultProps {
        export let cspId: any;
        export { recordEventFn as recordEvent };
    }
    namespace propTypes {
        let cspId_1: PropTypes.Requireable<string>;
        export { cspId_1 as cspId };
        export let recordEvent: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
