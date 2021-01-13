import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { pageNames } from './pageList';
import {
  BDD_INFO_URL,
  DISABILITY_526_V2_ROOT_URL,
} from 'applications/disability-benefits/all-claims/constants';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';

function alertContent(getPageStateFromPageName, setWizardStatus) {
  const stateBDD = getPageStateFromPageName('bdd');

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
    .format('MMM D, YYYY');

  return (
    <>
      <p>
        Based on your separation date, you can file a disability claim under the
        Benefits Delivery at Discharge (BDD) program. This program allows
        service members to apply for disability benefits 180 to 90 days before
        they leave the military. You'll need to be available for 45 days after
        you submit your claim for a VA exam.
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
      <p>
        <a href={BDD_INFO_URL}>
          Learn more about the Benefits Delivery at Discharge (BDD) program
        </a>
      </p>
      {/* Remove link to introduction page once show526Wizard flipper is at
      100% */}
      {window.location.pathname.includes(DISABILITY_526_V2_ROOT_URL) ? (
        <button
          onClick={() => setWizardStatus(WIZARD_STATUS_COMPLETE)}
          className="usa-button-primary va-button-primary"
        >
          File a Benefits Delivery at Discharge claim
        </button>
      ) : (
        <a
          href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
          className="usa-button-primary va-button-primary"
        >
          File a Benefits Delivery at Discharge claim
        </a>
      )}
    </>
  );
}

const FileBDDClaim = ({ getPageStateFromPageName, setWizardStatus }) => (
  <AlertBox
    status="info"
    headline="You’re eligible to file a BDD claim"
    content={alertContent(getPageStateFromPageName, setWizardStatus)}
  />
);

export default {
  name: pageNames.fileBDD,
  component: FileBDDClaim,
};
