import React from 'react';
import moment from 'moment';
import ErrorableDate from '@department-of-veterans-affairs/formation-react/ErrorableDate';
import { pageNames } from './pageList';

// Figure out which page to go to based on the date entered
const findNextPage = state => {
  const date = moment({
    day: state.day.value,
    // moment takes 0-indexed months, but the date picker provides 1-indexed months
    month: parseInt(state.month.value, 10) - 1,
    year: state.year.value,
  });
  const feb19 = moment('2019-02-19');

  if (date.isAfter(feb19, 'day')) {
    return pageNames.decisionReview;
  }
  if (date.isAfter(moment().subtract(1, 'year'), 'day')) {
    return pageNames.fileAppeal;
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
    <ErrorableDate
      label="What’s the official date of VA’s decision?"
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
