import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from './pageList';
import { formIdSuffixes } from 'applications/static-pages/wizard/';

const newBenefitOptions = [
  { label: 'Applying for a new benefit', value: 'new' },
  {
    label: (
      <span className="radioText">
        Updating my program of study or place of training
      </span>
    ),
    value: 'update',
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

const NewBenefit = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
  setReferredBenefit,
}) => (
  <RadioButtons
    name={`${pageNames.newBenefit}`}
    label="Are you applying for a benefit or updating your program or place of training?"
    id={`${pageNames.newBenefit}`}
    additionalFieldsetClass="wizard-fieldset"
    options={newBenefitOptions}
    onValueChange={({ value }) => {
      const claimingBenefitOwnServiceAnswer = getPageStateFromPageName(
        pageNames.claimingBenefitOwnService,
      )?.selected;
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
        value === 'new' &&
        claimingBenefitOwnServiceAnswer === 'yes' &&
        nationalCallToServiceAnswer === 'yes'
      ) {
        return setPageState({ selected: value }, pageNames.warningAlert);
      } else if (
        (value === 'new' &&
          claimingBenefitOwnServiceAnswer === 'no' &&
          sponsorDeceasedAnswer === 'no') ||
        value === 'update'
      ) {
        return setPageState({ selected: value }, pageNames.transferredBenefits);
      } else if (
        (value === 'update' && transferredBenefitsAnswer === 'own') ||
        (value === 'update' && transferredBenefitsAnswer === 'transferred')
      ) {
        const { FORM_ID_1995 } = formIdSuffixes;
        setReferredBenefit(FORM_ID_1995);
        return setPageState({ selected: value }, pageNames.applyNow);
      } else if (value === 'update' && transferredBenefitsAnswer === 'fry') {
        const { FORM_ID_5495 } = formIdSuffixes;
        setReferredBenefit(FORM_ID_5495);
        return setPageState({ selected: value }, pageNames.applyNow);
      } else if (value === 'new') {
        return setPageState(
          { selected: value },
          pageNames.claimingBenefitOwnService,
        );
      } else if (value === 'extend') {
        return setPageState({ selected: value }, pageNames.STEMScholarship);
      } else {
        return setPageState({ selected: value });
      }
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames?.newBenefit,
  component: NewBenefit,
};
