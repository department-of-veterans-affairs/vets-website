import React from 'react';
import { formIdSuffixes } from 'applications/static-pages/wizard/';
import { pageNames } from './pageList';
import VARadioButton from '../../../gi/components/VARadioButton';

const claimingBenefitOwnServiceOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];
const ClaimingBenefitOwnService = ({
  setPageState,
  getPageStateFromPageName,
  setReferredBenefit,
}) => (
  <div>
    <VARadioButton
      radioLabel="Are you a Veteran or service member claiming a benefit based on your own service?"
      initialValue=""
      options={claimingBenefitOwnServiceOptions}
      onVaValueChange={event => {
        const { value } = event.detail;
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
    />
  </div>
);

export default {
  name: pageNames?.claimingBenefitOwnService,
  component: ClaimingBenefitOwnService,
};
