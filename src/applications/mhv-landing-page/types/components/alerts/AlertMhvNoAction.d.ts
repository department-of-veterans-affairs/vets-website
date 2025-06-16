export default AlertMhvNoAction;
declare function AlertMhvNoAction({ errorCode, testId, recordEvent }: {
    errorCode: any;
    testId: any;
    recordEvent: any;
}): React.JSX.Element;
declare namespace AlertMhvNoAction {
    namespace defaultProps {
        export let title: string;
        export let errorCode: string;
        export { recordEventFn as recordEvent };
        export let testId: string;
    }
    namespace propTypes {
        let errorCode_1: PropTypes.Requireable<string>;
        export { errorCode_1 as errorCode };
        let title_1: PropTypes.Requireable<string>;
        export { title_1 as title };
        export let headline: PropTypes.Requireable<string>;
        export let recordEvent: PropTypes.Requireable<(...args: any[]) => any>;
        let testId_1: PropTypes.Requireable<string>;
        export { testId_1 as testId };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
