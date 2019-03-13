import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const options = [
  { value: pageNames.fileOriginalClaim, label: 'Yes' },
  { value: pageNames.appeals, label: 'No' },
];

const OriginalClaimPage = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name="start-page-option"
    label="Is this your first time filing a claim with VA?"
    id="start-page-option"
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value })}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.originalClaim,
  component: OriginalClaimPage,
};
