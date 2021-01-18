import React from 'react';
import moment from 'moment';

import { BDD_INFO_URL } from 'applications/disability-benefits/all-claims/constants';

import { pageNames } from './pageList';
import { formStartButton } from '../wizard-utils';

const FileBDDClaim = ({ getPageStateFromPageName, setWizardStatus }) => {
  const stateBDD = getPageStateFromPageName('bdd');

  const label = 'File a BDD disability claim online';
  const linkText = 'Learn more about the BDD program';

  const dateDischarge = moment({
    day: stateBDD.day.value,
    // moment takes 0-indexed months, but the date picker provides 1-indexed months
    month: parseInt(stateBDD.month.value, 10) - 1,
    year: stateBDD.year.value,
  });
  const dateToday = moment();
  const differenceBetweenDatesInDays =
    dateDischarge.diff(dateToday, 'days') + 1;

  const daysRemainingToFileBDD = differenceBetweenDatesInDays - 90;
  const isLastDayToFileBDD = daysRemainingToFileBDD === 0;
  const dateOfLastBDDEligibility = moment()
    .add(daysRemainingToFileBDD, 'days')
    .format('MMMM D, YYYY');

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on your separation date, you can file a disability claim under the
        Benefits Delivery at Discharge (BDD) program.
      </p>
      <p>
        {isLastDayToFileBDD ? (
          <>
            This is your <b>last day</b>
          </>
        ) : (
          <>
            You have <b>{daysRemainingToFileBDD}</b> day(s) left
          </>
        )}{' '}
        to file a BDD claim.{' '}
        {isLastDayToFileBDD ? (
          <>
            You have until <b>11:59 p.m. CST</b>
          </>
        ) : (
          <>
            You have until <b>{dateOfLastBDDEligibility} at 11:59 p.m. CST</b>
          </>
        )}{' '}
        to complete and submit the form.
      </p>
      {formStartButton({
        setWizardStatus,
        label,
        ariaId: 'learn_about_bdd',
      })}
      <p id="learn_about_bdd">
        <a href={BDD_INFO_URL}>{linkText}</a>
      </p>
    </div>
  );
};

export default {
  name: pageNames.fileBDD,
  component: FileBDDClaim,
};
