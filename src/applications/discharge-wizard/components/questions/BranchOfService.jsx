import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const { Element } = Scroll;

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

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }

  const options = [
    { label: 'Army', value: 'army' },
    { label: 'Navy', value: 'navy' },
    { label: 'Air Force', value: 'airForce' },
    { label: 'Coast Guard', value: 'coastGuard' },
    { label: 'Marine Corps', value: 'marines' },
  ];

  const radioButtonProps = {
    name: key,
    label: 'In which branch of service did you serve?',
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
      <VaRadio {...radioButtonProps} uswds={false}>
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

BranchOfServiceQuestion.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default BranchOfServiceQuestion;
