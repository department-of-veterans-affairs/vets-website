import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

const PrevApplication = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '8_prevApplication';

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
      Have you previously applied for and been denied a discharge upgrade for
      this period of service? Note: You can still apply. Your answer to this
      question simply changes where you send your application.
    </h4>
  );
  const options = [{ label: 'Yes', value: '1' }, { label: 'No', value: '2' }];
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

PrevApplication.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default PrevApplication;
