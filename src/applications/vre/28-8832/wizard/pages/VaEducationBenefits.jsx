import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.beginFormNow,
    label: 'Yes',
  },
  {
    value: pageNames.dischargeStatus,
    label: 'No',
  },
];

const EducationBenefits = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name="education-benefits"
    label="Are you using VA education benefits to go to school?"
    options={options}
    id="education-benefits"
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: 'VAEducationBenefits',
  component: EducationBenefits,
};
