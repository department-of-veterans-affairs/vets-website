import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const nationalCallToServiceOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const NationalCallToService = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
}) => (
  <ErrorableRadioButtons
    name={`${pageNames.nationalCallToService}`}
    label={
      <span>
        Are you claiming a <strong>National Call to Service</strong> education
        benefit? (This is uncommon)
      </span>
    }
    id={`${pageNames.nationalCallToService}`}
    additionalFieldsetClass="wizard-fieldset"
    options={nationalCallToServiceOptions}
    onValueChange={({ value }) => {
      const claimingBenefitAnswer = getPageStateFromPageName(
        pageNames.claimingBenefit,
      )?.selected;
      const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
        ?.selected;
      if (claimingBenefitAnswer === 'own' && value === 'no') {
        return setPageState({ selected: value }, pageNames.vetTec);
      } else if (newBenefitAnswer === 'yes' && value === 'yes') {
        return setPageState({ selected: value }, pageNames.warningAlert);
      } else {
        return setPageState({ selected: value });
      }
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames?.nationalCallToService,
  component: NationalCallToService,
};
