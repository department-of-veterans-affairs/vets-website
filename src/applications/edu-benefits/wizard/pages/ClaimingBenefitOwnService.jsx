import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { formIdSuffixes } from 'applications/static-pages/wizard/';
import { pageNames } from './pageList';

const claimingBenefitOwnServiceOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];
const ClaimingBenefitOwnService = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
  setReferredBenefit,
}) => (
  <div>
    <RadioButtons
      name={`${pageNames.claimingBenefitOwnService}`}
      label="Are you a Veteran or service member claiming a benefit based on your own service?"
      id={`${pageNames.claimingBenefitOwnService}`}
      additionalFieldsetClass="wizard-fieldset"
      options={claimingBenefitOwnServiceOptions}
      onValueChange={({ value }) => {
        const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
          ?.selected;
        const sponsorDeceasedAnswer = getPageStateFromPageName(
          pageNames.sponsorDeceased,
        )?.selected;
        const transferredBenefitsAnswer = getPageStateFromPageName(
          pageNames.transferredBenefits,
        )?.selected;
        if (
          newBenefitAnswer === 'new' &&
          value === 'no' &&
          transferredBenefitsAnswer === 'no'
        ) {
          return setPageState({ selected: value }, pageNames.sponsorDeceased);
        }
        if (
          newBenefitAnswer === 'new' &&
          value === 'no' &&
          sponsorDeceasedAnswer === 'yes'
        ) {
          const { FORM_ID_5490 } = formIdSuffixes;
          setReferredBenefit(FORM_ID_5490);
          return setPageState({ selected: value }, pageNames.applyNow);
        }
        if (newBenefitAnswer === 'new' && value === 'yes') {
          return setPageState({ selected: value }, pageNames.vetTec);
        }
        if (newBenefitAnswer === 'new' && value === 'no') {
          return setPageState({ selected: value }, pageNames.sponsorDeceased);
        }
        return setPageState({ selected: value });
      }}
      value={{ value: state.selected }}
    />
  </div>
);

export default {
  name: pageNames?.claimingBenefitOwnService,
  component: ClaimingBenefitOwnService,
};
