import React from 'react';
import moment from 'moment';
import ErrorableDate from '@department-of-veterans-affairs/formation-react/ErrorableDate';
import { pageNames } from './pageList';

import environment from 'platform/utilities/environment';
import unableToFileBDD from './unable-to-file-bdd';

// Figure out which page to go to based on the date entered
const findNextPage = state => {
  const dateDischarge = moment({
    day: state.day.value,
    // moment takes 0-indexed months, but the date picker provides 1-indexed months
    month: parseInt(state.month.value, 10) - 1,
    year: state.year.value,
  });
  const dateToday = moment();
  const differenceBetweenDatesInDays =
    dateDischarge.diff(dateToday, 'days') + 1;

  if (
    differenceBetweenDatesInDays >= 90 &&
    differenceBetweenDatesInDays <= 180
  ) {
    return pageNames.fileBDD;
  }
  return pageNames.unableToFileBDD;
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

const BDDPage = ({ setPageState, state = defaultState }) => {
  const onChange = pageState =>
    setPageState(
      pageState,
      isDateComplete(pageState) ? findNextPage(pageState) : undefined,
    );

  if (environment.isProduction()) {
    return <unableToFileBDD.component />;
  }

  return (
    <ErrorableDate
      label="Date or anticipated date of release from active duty"
      onValueChange={onChange}
      name="discharge-date"
      date={state}
    />
  );
};

export default {
  name: pageNames.bdd,
  component: BDDPage,
};
