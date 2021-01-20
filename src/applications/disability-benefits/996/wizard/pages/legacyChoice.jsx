import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';

const label = (
  <p>
    Is this claim going through the{' '}
    <a
      href="/disability/file-an-appeal/"
      onClick={() => {
        recordEvent({
          event: 'howToWizard-alert-link-click',
          'howToWizard-alert-link-click-label': 'legacy appeals',
        });
      }}
    >
      legacy appeals
    </a>{' '}
    process?
  </p>
);

const options = [
  { value: pageNames.legacyNo, label: 'No' },
  { value: pageNames.legacyYes, label: 'Yes' },
];

const name = 'higher-level-review-legacy';

const LegacyChoice = ({ setPageState, state = {} }) => {
  return (
    <RadioButtons
      name={name}
      id={name}
      label={label}
      options={options}
      onValueChange={({ value }) => {
        recordEvent({
          event: 'howToWizard-formChange',
          'form-field-type': 'form-radio-buttons',
          'form-field-label':
            'Is this claim going through the legacy appeals process?',
          'form-field-value': value,
        });
        setPageState({ selected: value }, value);
      }}
      value={{ value: state.selected }}
      additionalFieldsetClass={`${name}-legacy vads-u-margin-top--0`}
    />
  );
};

export default {
  name: pageNames.legacyChoice,
  component: LegacyChoice,
};
