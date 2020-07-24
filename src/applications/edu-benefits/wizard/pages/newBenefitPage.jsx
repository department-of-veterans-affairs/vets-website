import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const newBenefitOptions = [
  { label: 'Applying for a new benefit', value: 'yes' },
  {
    label: (
      <span className="radioText">
        Updating my program of study or place of training
      </span>
    ),
    value: 'no',
  },
  {
    label: (
      <span className="radioText">
        Applying to extend my Post-9/11 or Fry Scholarship benefits using the
        Edith Nourse Rogers STEM Scholarship
      </span>
    ),
    value: 'extend',
  },
];

const newBenefitPage = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.newBenefit}`}
    label="Are you applying for a benefit or updating your program or place of training?"
    id={`${pageNames.newBenefit}`}
    additionalFieldsetClass="wizard-fieldset"
    options={newBenefitOptions}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.newBenefitPage,
  component: newBenefitPage,
};
