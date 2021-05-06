import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

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

  const label = (
    <h4>
      Did you complete a period of service in which your character of service
      was Honorable or General Under Honorable Conditions?
    </h4>
  );

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

PriorService.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default PriorService;
