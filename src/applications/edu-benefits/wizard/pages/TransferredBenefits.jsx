import React, { useState } from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const getTransferredBenefitOptions = sponsorDeceasedValue =>
  sponsorDeceasedValue === 'no'
    ? [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
    : [
        {
          label: 'No, I’m using my own benefit.',
          value: 'own',
        },
        {
          label: 'Yes, I’m using a transferred benefit.',
          value: 'transferred',
        },
        {
          label: (
            <span className="radioText">
              No, I’m using the Fry Scholarship or DEA (Chapter 35)
            </span>
          ),
          value: 'fry',
        },
      ];

const TransferredBenefits = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
}) => {
  const [sponsorDeceasedValue, setSponsorDeceasedValue] = useState(undefined);
  const wasSponsorDeceasedAnswered = !!getPageStateFromPageName(
    pageNames.sponsorDeceased,
  )?.selected;
  if (!sponsorDeceasedValue && wasSponsorDeceasedAnswered) {
    setSponsorDeceasedValue(
      getPageStateFromPageName(pageNames.sponsorDeceased)?.selected,
    );
  }
  const transferredBenefitOptions = getTransferredBenefitOptions(
    sponsorDeceasedValue,
  );

  return (
    <ErrorableRadioButtons
      name={`${pageNames.transferredBenefits}`}
      label={
        sponsorDeceasedValue === 'no'
          ? 'Has your sponsor transferred their benefits to you?'
          : 'Are you receiving education benefits transferred to you by a sponsor Veteran?'
      }
      id={`${pageNames.transferredBenefits}`}
      additionalFieldsetClass="wizard-fieldset"
      options={transferredBenefitOptions}
      onValueChange={({ value }) => {
        const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
          ?.selected;
        const claimingBenefitOwnServiceAnswer = getPageStateFromPageName(
          pageNames.claimingBenefit,
        )?.selected;
        const sponsorDeceasedAnswer = getPageStateFromPageName(
          pageNames.sponsorDeceased,
        )?.selected;
        if (
          newBenefitAnswer === 'yes' &&
          claimingBenefitOwnServiceAnswer === 'other' &&
          sponsorDeceasedAnswer === 'no' &&
          value === 'no'
        ) {
          return setPageState({ selected: value }, pageNames.warningAlert);
        } else if (newBenefitAnswer === 'no' && value === 'own') {
          return setPageState({ selected: value }, pageNames.applyNow);
        } else if (newBenefitAnswer === 'no' && value === 'transferred') {
          return setPageState({ selected: value }, pageNames.applyNow);
        } else if (newBenefitAnswer === 'no' && value === 'fry') {
          return setPageState({ selected: value }, pageNames.applyNow);
        } else {
          return setPageState({ selected: value }, pageNames.applyNow);
        }
      }}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: pageNames?.transferredBenefits,
  component: TransferredBenefits,
};
