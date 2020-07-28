import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';
import { FORM_ID_0994, FORM_ID_1990 } from '../../../static-pages/wizard';

const vetTecOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const VetTec = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
  setBenefitReferred,
}) => (
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
      const nationalCallToServiceAnswer = getPageStateFromPageName(
        pageNames.nationalCallToService,
      )?.selected;
      if (
        claimingBenefitOwnServiceAnswer === 'yes' &&
        nationalCallToServiceAnswer === 'no' &&
        value === 'yes'
      ) {
        setBenefitReferred(FORM_ID_0994);
        return setPageState({ selected: value }, pageNames.applyNow);
      } else if (
        claimingBenefitOwnServiceAnswer === 'yes' &&
        nationalCallToServiceAnswer === 'no' &&
        value === 'no'
      ) {
        setBenefitReferred(FORM_ID_1990);
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
