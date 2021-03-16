import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from './pageList';
import { formIdSuffixes } from 'applications/static-pages/wizard/';

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
  setReferredBenefit,
}) => {
  const sponsorDeceasedAnswer = getPageStateFromPageName(
    pageNames.sponsorDeceased,
  )?.selected;

  const transferredBenefitOptions = getTransferredBenefitOptions(
    sponsorDeceasedAnswer,
  );

  return (
    <RadioButtons
      name={`${pageNames.transferredBenefits}`}
      label={
        sponsorDeceasedAnswer === 'no'
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
          pageNames.claimingBenefitOwnService,
        )?.selected;
        if (
          claimingBenefitOwnServiceAnswer === 'no' &&
          sponsorDeceasedAnswer === 'no' &&
          value === 'no'
        ) {
          return setPageState({ selected: value }, pageNames.warningAlert);
        } else if (
          claimingBenefitOwnServiceAnswer === 'no' &&
          sponsorDeceasedAnswer === 'no' &&
          value === 'yes'
        ) {
          const { FORM_ID_1990E } = formIdSuffixes;
          setReferredBenefit(FORM_ID_1990E);
          return setPageState({ selected: value }, pageNames.applyNow);
        } else if (
          (newBenefitAnswer === 'update' && value === 'own') ||
          (newBenefitAnswer === 'update' && value === 'transferred')
        ) {
          const { FORM_ID_1995 } = formIdSuffixes;
          setReferredBenefit(FORM_ID_1995);
          return setPageState({ selected: value }, pageNames.applyNow);
        } else if (newBenefitAnswer === 'update' && value === 'fry') {
          const { FORM_ID_5495 } = formIdSuffixes;
          setReferredBenefit(FORM_ID_5495);
          return setPageState({ selected: value }, pageNames.applyNow);
        } else {
          return setPageState({ selected: value });
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
