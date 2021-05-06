import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

const CourtMartial = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '7_courtMartial';

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
      Was your discharge the outcome of a <strong>general</strong>{' '}
      court-martial?
    </h4>
  );
  const options = [
    {
      label: 'Yes, my discharge was the outcome of a general court-martial.',
      value: '1',
    },
    {
      label:
        'No, my discharge was administrative or the outcome of a special or summary court-martial.',
      value: '2',
    },
    { label: "I'm not sure.", value: '3' },
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

CourtMartial.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default CourtMartial;
