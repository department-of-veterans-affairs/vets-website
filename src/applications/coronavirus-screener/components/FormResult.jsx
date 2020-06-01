import React from 'react';
import { Element } from 'react-scroll';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import classnames from 'classnames';

function recordScreeningToolEvent({ result, startTime }) {
  const timeToComplete = moment().unix() - startTime;
  recordEvent({
    event: 'covid-screening-tool-result-displayed',
    'screening-tool-result': result,
    'time-to-complete': timeToComplete,
  });
}

function Complete({ children }) {
  return (
    <div>
      {children}
      <h3>Valid for:</h3>
      <h3>{moment().format('dddd, MMMM D, h:mm a')}</h3>
      <div className="vads-u-font-size--h3">
        <p>
          Please show this screen to the staff member at the facility entrance.
        </p>
        <p>Thank you for helping us protect you and others during this time.</p>
      </div>
    </div>
  );
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

export default function FormResult({ questions, formState }) {
  const status = formState.status;

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

  if (status !== 'incomplete') {
    console.log(status);
    recordScreeningToolEvent({
      result: results[status].event,
      startTime: formState.startTime,
    });
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
