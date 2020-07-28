import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const vetTecOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const VetTec = ({ setPageState, getPageStateFromPageName, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.vetTec}`}
    label={
      <span>
        Are you applying for Veteran Employment Through Technology Education
        Courses (VET TEC)?
      </span>
    }
    id={`${pageNames.vetTec}`}
    additionalFieldsetClass="wizard-fieldset"
    options={vetTecOptions}
    onValueChange={({ value }) => {
      const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
        ?.selected;
      const claimingBenefitOwnServiceAnswer = getPageStateFromPageName(
        pageNames.claimingBenefitOwnService,
      )?.selected;
      if (
        newBenefitAnswer === 'new' &&
        claimingBenefitOwnServiceAnswer === 'yes' &&
        value === 'yes'
      ) {
        return setPageState({ selected: value }, pageNames.applyNow);
      } else if (
        newBenefitAnswer === 'new' &&
        claimingBenefitOwnServiceAnswer === 'yes' &&
        value === 'no'
      ) {
        return setPageState({ selected: value }, pageNames.applyNow);
      } else {
        return setPageState({ selected: value });
      }
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames?.vetTec,
  component: VetTec,
};
