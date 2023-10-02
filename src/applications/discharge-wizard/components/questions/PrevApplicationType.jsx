import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const { Element } = Scroll;

const PrevApplicationType = ({
  formValues,
  handleKeyDown,
  scrollToLast,
  updateField,
}) => {
  const key = '10_prevApplicationType';

  if (!formValues) {
    return null;
  }

  if (!shouldShowQuestion(key, formValues.questions)) {
    return null;
  }

  let boardLabel =
    'I applied to a Board for Correction of Military Records (BCMR)';
  if (['navy', 'marines'].includes(formValues['1_branchOfService'])) {
    boardLabel =
      'I applied to the Board for Correction of Naval Records (BCNR)';
  }

  const options = [
    {
      label:
        'I applied to a Discharge Review Board (DRB) for a Documentary Review',
      value: '1',
    },
    {
      label:
        'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review in Washington, DC',
      value: '2',
    },
    { label: boardLabel, value: '3' },
    { label: "I'm not sure", value: '4' },
  ];

  const radioButtonProps = {
    name: key,
    label:
      'What type of application did you make to upgrade your discharge previously?',
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

PrevApplicationType.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default PrevApplicationType;
