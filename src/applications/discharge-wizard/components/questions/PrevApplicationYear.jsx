import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { prevApplicationYearCutoff } from '../../constants';
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

const PrevApplicationYear = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '9_prevApplicationYear';

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

  const prevApplicationYearLabel = (
    <h4>What year did you apply for a discharge upgrade?</h4>
  );

  const labelYear = prevApplicationYearCutoff[formValues['4_reason']];

  const prevApplicationYearOptions = [
    { label: `${labelYear} or earlier`, value: '1' },
    { label: `After ${labelYear}`, value: '2' },
  ];

  const radioButtonProps = {
    name: key,
    label: prevApplicationYearLabel,
    options: prevApplicationYearOptions,
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

PrevApplicationYear.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default PrevApplicationYear;
