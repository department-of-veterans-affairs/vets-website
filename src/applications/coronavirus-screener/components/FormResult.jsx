import React from 'react';
import { Element } from 'react-scroll';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import classnames from 'classnames';

const Incomplete = () => <div>Please answer all the questions above.</div>;

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

export default function FormResult({ questionState, formState }) {
  const resultList = {
    pass: {
      content: <Pass />,
      class: 'pass',
    },
    fail: {
      content: <Fail />,
      class: 'fail',
    },
    incomplete: {
      content: <Incomplete />,
      class: 'incomplete',
    },
  };

  const resultContent = resultList[formState.status].content;

  return (
    <div
      className={classnames(
        'feature',
        'covid-screener-results',
        `covid-screener-results-${resultList[formState.status].class}`,
      )}
    >
      <Element
        name={`multi-question-form-${questionState.length}-scroll-element`}
      />
      <div>{resultContent}</div>
    </div>
  );
}
