import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

// Relative Imports
import { shouldShowQuestion } from '../../helpers';

const Element = Scroll.Element;

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

  const prevApplicationTypeLabel = (
    <h4>
      What type of application did you make to upgrade your discharge
      previously?
    </h4>
  );

  let boardLabel =
    'I applied to a Board for Correction of Military Records (BCMR)';
  if (['navy', 'marines'].includes(formValues['1_branchOfService'])) {
    boardLabel =
      'I applied to the Board for Correction of Naval Records (BCNR)';
  }

  const prevApplicationTypeOptions = [
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
    label: prevApplicationTypeLabel,
    options: prevApplicationTypeOptions,
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

PrevApplicationType.propTypes = {
  formValues: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func,
  scrollToLast: PropTypes.func,
  updateField: PropTypes.func,
};

export default PrevApplicationType;
