export namespace defaultProps {
    export let headline: string;
    export { recordEventFn as recordEvent };
    export let ssoe: boolean;
    export let testId: string;
}
export default AlertUnregistered;
/**
 * AlertUnregistered component
 * @param {object} props
 * @param {string} props.headline
 * @param {function} [props.recordEvent=recordEventFn]
 * @param {boolean} props.ssoe
 * @param {string} [props.testId]
 * @returns {JSX.Element}
 */
declare function AlertUnregistered({ headline, recordEvent, ssoe, testId, }: {
    headline: string;
    recordEvent?: Function;
    ssoe: boolean;
    testId?: string;
}): JSX.Element;
