import React from 'react';
import moment from 'moment';
import Date from '@department-of-veterans-affairs/component-library/Date';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';
import unableToFileBDDProduction from './unable-to-file-bdd-production';
import {
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../../all-claims/constants';

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

  if (differenceBetweenDatesInDays < 90) {
    saveDischargeDate(dateDischarge, false);
    return pageNames.fileClaimEarly;
  } else if (differenceBetweenDatesInDays <= 180) {
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

const isDateInFuture = date => date && date.diff(moment()) > 0;

const BDDPage = ({ setPageState, state = defaultState, allowBDD }) => {
  if (!allowBDD) {
    // BDD at 100%, this will need to be removed along with the
    // form526_benefits_delivery_at_discharge feature flag
    return <unableToFileBDDProduction.component />;
  }

  const onChange = pageState => {
    saveDischargeDate();
    const date = isDateComplete(pageState) ? getDate(pageState) : null;
    const value = isDateInFuture(date) ? findNextPage(pageState) : null;

    if (value) {
      recordEvent({
        event: 'howToWizard-formChange',
        // Date component wrapper class name
        'form-field-type': 'usa-date-of-birth',
        'form-field-label': label,
        'form-field-value': date.format('YYYY-MM-DD'),
      });
    }
    setPageState(pageState, value);
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
      />
    </div>
  );
};

export default {
  name: pageNames.bdd,
  component: BDDPage,
};
