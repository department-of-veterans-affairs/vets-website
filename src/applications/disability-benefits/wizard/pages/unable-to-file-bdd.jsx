import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';
import { BDD_INFO_URL } from '../../constants';

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
        You are ineligible to file a claim at this time. Please return in{' '}
        <b>{differenceBetweenDatesInDays - 180}</b> day(s) in order to file your
        BDD claim.
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
    headline="You are ineligible to file a BDD claim"
    content={alertContent(getPageStateFromPageName)}
  />
);

export default {
  name: pageNames.unableToFileBDD,
  component: UnableToFileBDDPage,
};
