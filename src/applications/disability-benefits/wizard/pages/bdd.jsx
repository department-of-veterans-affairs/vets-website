import React, { useState } from 'react';
import moment from 'moment';
import Date from '@department-of-veterans-affairs/component-library/Date';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';
import {
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../../all-claims/constants';

const maxDate = moment().add(100, 'year');

const saveDischargeDate = (date, isBDD) => {
  if (date) {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    window.sessionStorage.setItem(SAVED_SEPARATION_DATE, formattedDate);
    // this flag helps maintain the correct form title within a session
    window.sessionStorage.setItem(FORM_STATUS_BDD, isBDD ? 'true' : 'false');
  } else {
    window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);
  }
};

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

  if (differenceBetweenDatesInDays < 0) {
    saveDischargeDate();
    return null;
  }

  if (differenceBetweenDatesInDays < 90) {
    saveDischargeDate(dateDischarge, false);
    return pageNames.fileClaimEarly;
  }

  if (differenceBetweenDatesInDays <= 180) {
    saveDischargeDate(dateDischarge, true);
    return pageNames.fileBDD;
  }

  saveDischargeDate();
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

const label =
  'What’s the date or anticipated date of your release from active duty?';

const isDateComplete = date =>
  date.day.value && date.month.value && date.year.value.length === 4;

const getDate = date =>
  moment({
    day: date.day.value,
    month: parseInt(date.month.value, 10) - 1,
    year: date.year.value,
  });

const isDateInFuture = date => date?.diff(moment()) > 0;
const isDateLessThanMax = date => date?.isBefore(maxDate);

const BDDPage = ({ setPageState, state = defaultState }) => {
  const [isNotEligible, setIsNotEligible] = useState(false);

  const onChange = pageState => {
    saveDischargeDate();
    const date = isDateComplete(pageState) ? getDate(pageState) : null;
    const value =
      isDateInFuture(date) && isDateLessThanMax(date)
        ? findNextPage(pageState)
        : null;
    if (date && value) {
      recordEvent({
        event: 'howToWizard-formChange',
        // Date component wrapper class name
        'form-field-type': 'usa-date-of-birth',
        'form-field-label': label,
        'form-field-value': date.format('YYYY-MM-DD'),
      });
    }
    // invalid date & page
    setPageState(pageState, date && value === null ? 1 : value);
    setIsNotEligible(value === pageNames.unableToFileBDD);
  };

  return (
    <div className="clearfix">
      <Date
        label={label}
        onValueChange={onChange}
        name="discharge-date"
        date={state}
        validation={{
          valid: isDateInFuture(getDate(state)),
          message: 'Your separation date must be in the future',
        }}
        aria-describedby={isNotEligible ? 'not-eligible-for-bdd' : ''}
      />
    </div>
  );
};

export default {
  name: pageNames.bdd,
  component: BDDPage,
};
