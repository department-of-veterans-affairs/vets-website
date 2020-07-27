import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

const claimingBenefitOptions = [
  { label: 'Yes', value: 'own' },
  { label: 'No', value: 'other' },
];

const ClaimingBenefitOwnService = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
}) => (
  <div>
    <ErrorableRadioButtons
      name={`${pageNames.claimingBenefit}`}
      label="Are you a Veteran or service member claiming a benefit based on your own service?"
      id={`${pageNames.claimingBenefit}`}
      additionalFieldsetClass="wizard-fieldset"
      options={claimingBenefitOptions}
      onValueChange={({ value }) => {
        const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
          ?.selected;
        const sponsorDeceasedAnswer = getPageStateFromPageName(
          pageNames.sponsorDeceased,
        )?.selected;
        const transferredBenefitsAnswer = getPageStateFromPageName(
          pageNames.transferredBenefits,
        )?.selected;
        const nationalCallToServiceAnswer = getPageStateFromPageName(
          pageNames.nationalCallToService,
        )?.selected;
        if (
          newBenefitAnswer === 'yes' &&
          value === 'other' &&
          sponsorDeceasedAnswer === 'no' &&
          transferredBenefitsAnswer === 'no'
        ) {
          return setPageState({ selected: value }, pageNames.warningAlert);
        } else if (nationalCallToServiceAnswer === 'no' && value === 'own') {
          return setPageState({ selected: value }, pageNames.vetTec);
        } else if (value === 'own') {
          return setPageState(
            { selected: value },
            pageNames.nationalCallToService,
          );
        } else {
          return setPageState({ selected: value }, pageNames.sponsorDeceased);
        }
      }}
      value={{ value: state.selected }}
    />
  </div>
);

export default {
  name: pageNames?.claimingBenefit,
  component: ClaimingBenefitOwnService,
};
