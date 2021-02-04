import React from 'react';
import moment from 'moment';
import { BDD_INFO_URL } from 'applications/disability-benefits/all-claims/constants';
import { pageNames } from '../constants';

const UnableToFileBDDPage = ({ getPageStateFromPageName }) => {
  const linkText = 'Learn more about the BDD program';
  const stateBDD = getPageStateFromPageName('todo');

  const dateDischarge = moment({
    day: stateBDD.day.value,
    // moment takes 0-indexed months, but the date picker provides 1-indexed months
    month: parseInt(stateBDD.month.value, 10) - 1,
    year: stateBDD.year.value,
  });
  const dateToday = moment();
  const differenceBetweenDatesInDays =
    dateDischarge.diff(dateToday, 'days') - 179;
  const dateEligible = dateToday
    .add(differenceBetweenDatesInDays, 'days')
    .format('MMMM D, YYYY');

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on your separation date, you’re not eligible to file for
        disability benefits right now.
      </p>
      <p>
        You’ll be eligible to file a disability claim under the Benefits
        Delivery at Discharge (BDD) program in{' '}
        <strong>{differenceBetweenDatesInDays}</strong> days (
        <strong>{dateEligible}</strong>
        ). This program allows you to apply for disability benefits before you
        leave the military.
      </p>
      <p>
        <a href={BDD_INFO_URL}>{linkText}</a>
      </p>
    </div>
  );
};

export default {
  name: pageNames.unableToFileBDD,
  component: UnableToFileBDDPage,
};
