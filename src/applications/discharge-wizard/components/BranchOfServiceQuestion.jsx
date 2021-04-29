import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../helpers';

const Element = Scroll.Element;

const BranchOfServiceQuestion = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '1_branchOfService';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues?.questions)) {
    return null;
  }

  const label = <h4>In which branch of service did you serve?</h4>;
  const options = [
    { label: 'Army', value: 'army' },
    { label: 'Navy', value: 'navy' },
    { label: 'Air Force', value: 'airForce' },
    { label: 'Coast Guard', value: 'coastGuard' },
    { label: 'Marine Corps', value: 'marines' },
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

BranchOfServiceQuestion.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default BranchOfServiceQuestion;
