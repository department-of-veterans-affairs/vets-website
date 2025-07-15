export default AlertAccountApiAlert;
declare function AlertAccountApiAlert({ errorCode, testId, recordEvent, userActionable, }: {
    errorCode: any;
    testId: any;
    recordEvent: any;
    userActionable?: boolean;
}): React.JSX.Element;
declare namespace AlertAccountApiAlert {
    namespace defaultProps {
        export let title: string;
        export let errorCode: number;
        export { recordEventFn as recordEvent };
        export let testId: string;
    }
    namespace propTypes {
        let errorCode_1: PropTypes.Requireable<number>;
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
