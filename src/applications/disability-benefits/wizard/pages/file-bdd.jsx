import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import { BDD_INFO_URL } from '../../constants';
import { BDD_FORM_ROOT_URL } from 'applications/disability-benefits/bdd/constants';

function alertContent(getPageStateFromPageName) {
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
        Based on your information, you may be eligible for the Benefits Delivery
        at Discharge program that allows service members to apply for VA
        disability benefits prior to separation.
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
        Please be aware that you will need to be available for 45 days after you
        file in order to complete VA exams during this period.
      </p>
      <p>
        <a href={BDD_INFO_URL}>
          Learn more about Benefits Delivery at Discharge (BDD)
        </a>
      </p>
      <a
        href={`${BDD_FORM_ROOT_URL}/introduction`}
        className="usa-button-primary va-button-primary"
      >
        File a Benefits Delivery at Discharge claim
      </a>
    </>
  );
}

const FileBDDClaim = ({ getPageStateFromPageName }) => (
  <AlertBox
    status="info"
    headline="You are eligible to file a BDD claim"
    content={alertContent(getPageStateFromPageName)}
  />
);

export default {
  name: pageNames.fileBDD,
  component: FileBDDClaim,
};
