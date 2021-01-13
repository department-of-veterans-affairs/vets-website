import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { pageNames } from './pageList';
import { BDD_INFO_URL } from 'applications/disability-benefits/all-claims/constants';

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

  return (
    <>
      <p>
        Based on your separation date, you may be eligible to file a disability
        claim under the Benefits Delivery at Discharge (BDD) program. This
        program allows service members to apply for disability benefits 180 to
        90 days before they leave the military.
      </p>
      <p>
        Since you have more than 180 days left on active duty, you can return in{' '}
        <b>{differenceBetweenDatesInDays - 180}</b> day(s) to file a BDD claim.
      </p>
      <p>
        <a href={BDD_INFO_URL}>Learn more about the BDD program</a>
      </p>
    </>
  );
}

const UnableToFileBDDPage = ({ getPageStateFromPageName }) => (
  <AlertBox
    status="warning"
    headline="You may be eligible to file a BDD claim"
    content={alertContent(getPageStateFromPageName)}
  />
);

export default {
  name: pageNames.unableToFileBDD,
  component: UnableToFileBDDPage,
};
