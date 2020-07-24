import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

const claimingBenefitNewBenefitYes = ({ setPageState, state = {} }) => {
  const claimingBenefitNewBenefitYesOptions = [
    { label: 'Yes', value: 'own' },
    { label: 'No', value: 'other' },
  ];
  return (
    <ErrorableRadioButtons
      name={`${pageNames.claimingBenefit}`}
      label="Are you a Veteran or service member claiming a benefit based on your own service?"
      id={`${pageNames.claimingBenefit}`}
      additionalFieldsetClass="wizard-fieldset"
      options={claimingBenefitNewBenefitYesOptions}
      onValueChange={({ value }) => setPageState({ selected: value }, value)}
      value={{ value: state.selected }}
    />
  );
};
const claimingBenefitNewBenefitNo = ({ setPageState, state = {} }) => {
  const claimingBenefitNewBenefitNoOptions = [
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
  return (
    <ErrorableRadioButtons
      name={`${pageNames.claimingBenefit}`}
      label="Are you receiving education benefits transferred to you by a sponsor Veteran?"
      id={`${pageNames.claimingBenefit}`}
      additionalFieldsetClass="wizard-fieldset"
      options={claimingBenefitNewBenefitNoOptions}
      onValueChange={({ value }) => setPageState({ selected: value }, value)}
      value={{ value: state.selected }}
    />
  );
};

const claimingBenefitPage = (getPageStateFromPageName, setPageState, state) => {
  const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefitPage);

  // const dateDischarge = moment({
  //   day: stateBDD.day.value,
  //   // moment takes 0-indexed months, but the date picker provides 1-indexed months
  //   month: parseInt(stateBDD.month.value, 10) - 1,
  //   year: stateBDD.year.value,
  // });
  // const dateToday = moment();
  // const differenceBetweenDatesInDays =
  //   dateDischarge.diff(dateToday, 'days') + 1;

  // const daysRemainingToFileBDD = differenceBetweenDatesInDays - 90;
  // const isLastDayToFileBDD = daysRemainingToFileBDD === 0;
  // const dateOfLastBDDEligibility = moment()
  //   .add(daysRemainingToFileBDD, 'days')
  //   .format('MMM D, YYYY');

  return (
    <div>
      {newBenefitAnswer === 'yes' &&
        claimingBenefitNewBenefitYes({ setPageState, state })}
      {newBenefitAnswer === 'no' &&
        claimingBenefitNewBenefitNo({ setPageState, state })}
    </div>
  );
};

export default {
  name: pageNames.claimingBenefit,
  component: claimingBenefitPage,
};
