import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';
import { pageNames } from './pageList';
import { RELATIONSHIP_STORAGE_KEY } from '../../constants';

const EducationBenefits = ({ setPageState, state = {} }) => {
  const relationship = sessionStorage.getItem(RELATIONSHIP_STORAGE_KEY);
  const isDependent = relationship === 'dependent';
  const options = isDependent
    ? [
        { value: 'dependentYes', label: 'Yes' },
        { value: 'dependentNo', label: 'No' },
      ]
    : [
        { value: pageNames.beginFormNow, label: 'Yes' },
        { value: pageNames.dischargeStatus, label: 'No' },
      ];

  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'Are you currently eligible for VA education benefits?',
      'form-field-value': value,
    });
    const next = isDependent ? pageNames.beginFormNow : value;
    setPageState({ selected: value }, next);
  };
  return (
    <VaRadio
      id="VAEducationBenefits"
      class="vads-u-margin-y--2"
      label="Are you currently eligible for VA education benefits?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="education-benefits"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.value : null
          }
        />
      ))}
    </VaRadio>
  );
};

export default {
  name: 'VAEducationBenefits',
  component: EducationBenefits,
};
