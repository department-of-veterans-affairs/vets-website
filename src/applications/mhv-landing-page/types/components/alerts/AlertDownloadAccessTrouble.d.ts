export default AlertDownloadAccessTrouble;
declare function AlertDownloadAccessTrouble({ className, headline, recordEvent, testId, }: {
    className: any;
    headline: any;
    recordEvent: any;
    testId: any;
}): React.JSX.Element;
declare namespace AlertDownloadAccessTrouble {
    namespace defaultProps {
        export let headline: string;
        export { recordEventFn as recordEvent };
        export let testId: string;
    }
    namespace propTypes {
        export let className: PropTypes.Requireable<string>;
        let headline_1: PropTypes.Requireable<string>;
        export { headline_1 as headline };
        export let recordEvent: PropTypes.Requireable<(...args: any[]) => any>;
        let testId_1: PropTypes.Requireable<string>;
        export { testId_1 as testId };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
