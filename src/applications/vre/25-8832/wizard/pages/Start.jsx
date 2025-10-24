import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';
import { pageNames } from './pageList';
import { RELATIONSHIP_STORAGE_KEY } from '../../constants';

const options = [
  {
    value: pageNames.isVeteran,
    label: 'Veteran',
    page: 'VREBenefits',
  },
  {
    value: pageNames.isServiceMember,
    label: 'Service member',
    page: 'VREBenefits',
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
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label': 'Which of these best describes you?',
      'form-field-value': value,
    });
    switch (value) {
      case 'isVeteran':
      case 'isServiceMember':
        sessionStorage.setItem(RELATIONSHIP_STORAGE_KEY, 'not-dependent');
        setPageState({ selected: value }, 'VREBenefits');
        break;
      case 'VAEducationBenefits':
        sessionStorage.setItem(RELATIONSHIP_STORAGE_KEY, 'dependent');
        setPageState({ selected: value }, value);
        break;
      case 'ineligibleNotice':
      default:
        sessionStorage.removeItem(RELATIONSHIP_STORAGE_KEY);
        setPageState({ selected: value }, 'ineligibleNotice');
    }
  };

  return (
    <VaRadio
      id="start"
      class="vads-u-margin-y--2"
      label="Which of these best describes you?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="claimant-relationship"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.page || option.value : null
          }
        />
      ))}
    </VaRadio>
  );
};

export default {
  name: 'start',
  component: StartPage,
};
