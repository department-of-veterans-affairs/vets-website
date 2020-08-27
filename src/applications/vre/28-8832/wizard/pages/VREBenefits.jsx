import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

const options = [
  {
    value: 'VRECounselorNotification',
    label: 'Yes',
  },
  {
    value: 'VAEducationBenefits',
    label: 'No',
  },
];

const VREBenefits = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name="vre-benefits"
    label="Are you receiving Chapter 31 Veteran Readiness and Employment (VR&E) benefits?"
    options={options}
    id="vre-benefits"
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: 'VREBenefits',
  component: VREBenefits,
};
