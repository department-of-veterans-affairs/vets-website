export default AlertVerifyAndRegister;
declare function AlertVerifyAndRegister({ recordEvent, testId }: {
    recordEvent: any;
    testId: any;
}): React.JSX.Element;
declare namespace AlertVerifyAndRegister {
    namespace defaultProps {
        export { recordEventFn as recordEvent };
        export let testId: string;
    }
    namespace propTypes {
        export let recordEvent: PropTypes.Requireable<(...args: any[]) => any>;
        let testId_1: PropTypes.Requireable<string>;
        export { testId_1 as testId };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
