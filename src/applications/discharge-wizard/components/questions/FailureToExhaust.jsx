import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const { Element } = Scroll;

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
    label:
      'Was your application denied due to "failure to exhaust other remedies"? Note: "Failure to exhaust other remedies" generally means you applied to the wrong board.',
    'label-header-level': '2',
    key,
    value: formValues[key],
    onVaValueChange: e => {
      if (e.returnValue) {
        updateField(key, e.detail.value);
      }
    },
    onMouseDown: scrollToLast,
    onKeyDown: handleKeyDown,
  };

  return (
    <div className="vads-u-margin-top--6">
      <Element name={key} />
      <VaRadio {...radioButtonProps}>
        {options.map((option, index) => (
          <va-radio-option
            key={index}
            label={option.label}
            name={key}
            value={option.value}
            checked={formValues[key] === option.value}
          />
        ))}
      </VaRadio>
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
