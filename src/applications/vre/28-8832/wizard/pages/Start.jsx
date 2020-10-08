import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
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
    <ErrorableRadioButtons
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
