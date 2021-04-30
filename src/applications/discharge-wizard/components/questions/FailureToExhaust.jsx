import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

const FailureToExhaust = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '11_failureToExhaust';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }

  const label = (
    <h4>
      Was your application denied due to “failure to exhaust other remedies”?
      Note: “Failure to exhaust other remedies” generally means you applied to
      the wrong board.
    </h4>
  );

  let boardLabel = 'BCMR';
  if (['navy', 'marines'].includes(formValues['1_branchOfService'])) {
    boardLabel = 'BCNR';
  }

  const options = [
    {
      label: `Yes, the ${boardLabel} denied my application due to “failure to exhaust other remedies.”`,
      value: '1',
    },
    {
      label: `No, the ${boardLabel} denied my application for other reasons, such as not agreeing with the evidence in my application.`,
      value: '2',
    },
  ];

  const radioButtonProps = {
    name: key,
    label,
    options,
    key,
    onValueChange: v => {
      if (v.dirty) {
        updateField(key, v.value);
      }
    },
    onMouseDown: scrollToLast,
    onKeyDown: handleKeyDown,
    value: {
      value: formValues[key],
    },
  };

  return (
    <div>
      <Element name={key} />
      <RadioButtons {...radioButtonProps} />
    </div>
  );
};

FailureToExhaust.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default FailureToExhaust;
