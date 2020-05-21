import React from 'react';
import { questions } from '../config/questions';
import { Element } from 'react-scroll';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import classnames from 'classnames';

export default function FormResult({ formState }) {
  let resultContent;

  let resultClass;

  const [resultSubmitted, setResultSubmittedState] = React.useState(false);

  const dateText = moment().format('dddd, MMMM D, h:mm a');

  function recordScreeningToolEvent(screeningToolResult) {
    if (!resultSubmitted) {
      recordEvent({
        event: 'covid-screening-tool-result-displayed',
        'screening-tool-result': screeningToolResult,
      });
      setResultSubmittedState(true);
    }
  }

  const Incomplete = () => <div>Please answer all the questions above.</div>;

  const Pass = () => (
    <>
      <i aria-hidden="true" role="presentation" className="fas fa-check" />
      <h2 className="vads-u-font-size--h1">OK to proceed</h2>
    </>
  );

  const Fail = () => (
    <h2 className="vads-u-font-size--h1">More screening needed</h2>
  );

  function Complete(props) {
    return (
      <div>
        {props.children}
        <h3>Valid for:</h3>
        <h3>{dateText}</h3>
        <div className="vads-u-font-size--h3">
          <p>
            Please show this screen to the staff member at the facility
            entrance.
          </p>
          <p>
            Thank you for helping us protect you and others during this time.
          </p>
        </div>
      </div>
    );
  }

  if (Object.values(formState).length < questions.length) {
    resultContent = <Incomplete />;
    resultClass = 'incomplete';
  } else if (Object.values(formState).includes('yes')) {
    resultContent = (
      <Complete>
        <Fail />
      </Complete>
    );
    resultClass = 'fail';
    recordScreeningToolEvent('More screening needed');
  } else {
    resultContent = (
      <Complete>
        <Pass />
      </Complete>
    );
    resultClass = 'pass';
    recordScreeningToolEvent('Pass');
  }

  return (
    <div
      className={classnames(
        'feature covid-screener-results',
        `covid-screener-results-${resultClass}`,
      )}
    >
      <Element
        name={`multi-question-form-${questions.length}-scroll-element`}
      />
      <div>{resultContent}</div>
    </div>
  );
}
