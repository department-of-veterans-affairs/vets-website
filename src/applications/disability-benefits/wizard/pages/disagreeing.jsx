import React from 'react';
import moment from 'moment';
import Date from '@department-of-veterans-affairs/formation-react/Date';
import { pageNames } from './pageList';

// Figure out which page to go to based on the date entered
export const findNextPage = state => {
  const date = moment({
    day: state.day.value,
    // moment takes 0-indexed months, but the date picker provides 1-indexed months
    month: parseInt(state.month.value, 10) - 1,
    year: state.year.value,
  });
  // The appeals process changed on this date
  // https://www.va.gov/opa/pressrel/pressrelease.cfm?id=5183
  const feb19 = moment('2019-02-19');

  // !isBefore == on or after
  if (!date.isBefore(feb19, 'day')) {
    return pageNames.decisionReview;
  }
  return pageNames.disagreeFileClaim;
};

const defaultState = {
  day: {
    value: '',
    dirty: false,
  },
  month: {
    value: '',
    dirty: false,
  },
  year: {
    value: '',
    dirty: false,
  },
};

const isDateComplete = date =>
  date.day.value && date.month.value && date.year.value.length === 4;

const DisagreeingPage = ({ setPageState, state = defaultState }) => {
  const onChange = pageState =>
    setPageState(
      pageState,
      isDateComplete(pageState) ? findNextPage(pageState) : undefined,
    );
  return (
    <Date
      label="What’s the date of VA’s decision?"
      onValueChange={onChange}
      name="decision-date"
      date={state}
    />
  );
};

export default {
  name: pageNames.disagreeing,
  component: DisagreeingPage,
};
