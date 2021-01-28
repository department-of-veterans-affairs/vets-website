import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.isVeteran,
    label: 'Veteran',
  },
  {
    value: pageNames.isServiceMember,
    label: 'Service member',
  },
  {
    value: pageNames.VAEducationBenefits,
    label: 'Dependent of a Veteran or service member',
  },
  {
    value: pageNames.ineligibleNotice,
    label: 'None of these',
  },
];

const StartPage = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ value }) => {
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label': 'Which of these best describes you?',
      'form-field-value': value,
    });
    switch (value) {
      case 'isVeteran':
      case 'isServiceMember':
        setPageState({ selected: value }, 'VREBenefits');
        break;
      case 'VAEducationBenefits':
        setPageState({ selected: value }, value);
        break;
      case 'ineligibleNotice':
      default:
        setPageState({ selected: value }, 'ineligibleNotice');
    }
  };

  return (
    <RadioButtons
      additionalFieldsetClass="vads-u-margin-top--1"
      name="claimant-relationship"
      label="Which of these best describes you?"
      id="claimant-relationship"
      options={options}
      onValueChange={handleValueChange}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: 'start',
  component: StartPage,
};
