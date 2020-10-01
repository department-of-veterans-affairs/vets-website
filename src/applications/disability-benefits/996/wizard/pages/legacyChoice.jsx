import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import pageNames from './pageNames';

const label = (
  <p>
    Are any of the decisions you would like to request a Higher-Level Review for
    currently in the <a href="/disability/file-an-appeal/">legacy appeals</a>{' '}
    process?
  </p>
);

const options = [
  { value: pageNames.legacyNo, label: 'No' },
  { value: pageNames.legacyYes, label: 'Yes' },
];

const name = 'higher-level-review-legacy';

const LegacyChoice = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    id={name}
    label={label}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
    additionalFieldsetClass={`${name}-legacy vads-u-margin-top--0`}
  />
);

export default {
  name: pageNames.legacyChoice,
  component: LegacyChoice,
};
