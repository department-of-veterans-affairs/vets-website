import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from './pageList';
import { formIdSuffixes } from 'applications/static-pages/wizard/';

const sponsorDeceasedOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const SponsorDeceased = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
  setReferredBenefit,
}) => (
  <RadioButtons
    name={`${pageNames.sponsorDeceased}`}
    label="Is your sponsor deceased, 100% permanently disabled, MIA, or a POW?"
    id={`${pageNames.sponsorDeceased}`}
    additionalFieldsetClass="wizard-fieldset"
    options={sponsorDeceasedOptions}
    onValueChange={({ value }) => {
      const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
        ?.selected;
      const claimingBenefitOwnServiceAnswer = getPageStateFromPageName(
        pageNames.claimingBenefitOwnService,
      )?.selected;
      const transferredBenefitsAnswer = getPageStateFromPageName(
        pageNames.transferredBenefits,
      )?.selected;
      if (
        claimingBenefitOwnServiceAnswer === 'no' &&
        value === 'no' &&
        transferredBenefitsAnswer === 'no'
      ) {
        return setPageState({ selected: value }, pageNames.warningAlert);
      } else if (
        newBenefitAnswer === 'new' &&
        claimingBenefitOwnServiceAnswer === 'no' &&
        value === 'no'
      ) {
        return setPageState({ selected: value }, pageNames.transferredBenefits);
      } else if (
        newBenefitAnswer === 'new' &&
        claimingBenefitOwnServiceAnswer === 'no' &&
        value === 'yes'
      ) {
        const { FORM_ID_5490 } = formIdSuffixes;
        setReferredBenefit(FORM_ID_5490);
        return setPageState({ selected: value }, pageNames.applyNow);
      } else {
        return setPageState({ selected: value });
      }
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames?.sponsorDeceased,
  component: SponsorDeceased,
};
