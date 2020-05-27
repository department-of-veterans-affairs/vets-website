import React from 'react';
import { questions } from '../config/questions';
import { Element } from 'react-scroll';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import classnames from 'classnames';

export default function FormResult({ formState }) {
  const [resultSubmitted, setResultSubmittedState] = React.useState(false);

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
    <Complete>
      <i aria-hidden="true" role="presentation" className="fas fa-check" />
      <h2 className="vads-u-font-size--h1">OK to proceed</h2>
    </Complete>
  );

  const Fail = () => (
    <Complete>
      <h2 className="vads-u-font-size--h1">More screening needed</h2>
    </Complete>
  );

  function Complete({ children }) {
    return (
      <div>
        {children}
        <h3>Valid for:</h3>
        <h3>{moment().format('dddd, MMMM D, h:mm a')}</h3>
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

  const results = {
    pass: {
      content: <Pass />,
      class: 'pass',
      event: 'Pass',
    },
    fail: {
      content: <Fail />,
      class: 'fail',
      event: 'More screening needed',
    },
    incomplete: {
      content: <Incomplete />,
      class: 'incomplete',
    },
  };

  const complete = Object.values(formState).length === questions.length;

  const outcome = Object.values(formState).includes('yes') ? 'fail' : 'pass';

  const status = complete ? outcome : 'incomplete';

  if (complete) {
    recordScreeningToolEvent(results[status].event);
  }

  const resultContent = results[status].content;

  return (
    <div
      className={classnames(
        'feature covid-screener-results',
        `covid-screener-results-${results[status].class}`,
      )}
    >
      <Element
        name={`multi-question-form-${questions.length}-scroll-element`}
      />
      <div>{resultContent}</div>
    </div>
  );
}
