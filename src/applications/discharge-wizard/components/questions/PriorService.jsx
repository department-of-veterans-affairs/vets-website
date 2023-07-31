import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const { Element } = Scroll;

const PriorService = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '12_priorService';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }

  // explicit override for dd214 condition
  if (formValues['4_reason'] === '8') {
    return null;
  }

  const options = [
    {
      label:
        'Yes, I have discharge paperwork documenting a discharge that is honorable or under honorable conditions.',
      value: '1',
    },
    {
      label:
        'Yes, I completed a prior period of service, but I did not receive discharge paperwork from that period.',
      value: '2',
    },
    {
      label: 'No, I did not complete an earlier period of service.',
      value: '3',
    },
  ];

  const radioButtonProps = {
    name: key,
    label:
      'Did you complete a period of service in which your character of service was Honorable or General Under Honorable Conditions?',
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

PriorService.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default PriorService;
