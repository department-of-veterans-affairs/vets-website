import React, { useState } from 'react';
import moment from 'moment';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';
import {
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../../all-claims/constants';

const dateTemplate = 'YYYY-MM-DD';
const maxDate = moment().add(100, 'year');

const saveDischargeDate = (date, isBDD) => {
  if (date) {
    window.sessionStorage.setItem(SAVED_SEPARATION_DATE, date);
    // this flag helps maintain the correct form title within a session
    window.sessionStorage.setItem(FORM_STATUS_BDD, isBDD ? 'true' : 'false');
  } else {
    window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);
  }
};

// Figure out which page to go to based on the date entered
const findNextPage = date => {
  const dateDischarge = moment(date, dateTemplate);
  const dateToday = moment();
  const differenceBetweenDatesInDays =
    dateDischarge.diff(dateToday, 'days') + 1;

  if (differenceBetweenDatesInDays < 0) {
    saveDischargeDate();
    return null;
  }

  if (differenceBetweenDatesInDays < 90) {
    saveDischargeDate(date, false);
    return pageNames.fileClaimEarly;
  }

  if (differenceBetweenDatesInDays <= 180) {
    saveDischargeDate(date, true);
    return pageNames.fileBDD;
  }

  saveDischargeDate();
  return pageNames.unableToFileBDD;
};

const label =
  'What’s the date or anticipated date of your release from active duty?';

const getDate = date => moment(date, dateTemplate);
const isDateComplete = date => date?.length === dateTemplate.length;
const isDateInFuture = date => date?.diff(moment()) > 0;
const isDateLessThanMax = date => date?.isBefore(maxDate);

const BDDPage = ({ setPageState, state = '' }) => {
  const [ariaDescribedby, setAriaDescribedby] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onChange = event => {
    const pageState = event.target.value || '';
    saveDischargeDate();
    const date = isDateComplete(pageState) ? getDate(pageState) : null;
    const nextPage =
      isDateInFuture(date) && isDateLessThanMax(date)
        ? findNextPage(pageState)
        : null;

    // invalid date & page
    setPageState(pageState, date && nextPage === null ? 1 : nextPage);

    if (date && nextPage) {
      // only set when there's a valid date
      setAriaDescribedby(nextPage);
      recordEvent({
        event: 'howToWizard-formChange',
        // Date component wrapper class name
        'form-field-type': 'usa-date-of-birth',
        'form-field-label': label,
        'form-field-value': pageState,
      });
    } else {
      setAriaDescribedby('');
    }

    let error = null;
    if (isDirty || date) {
      if (date) {
        // show an error message right away
        setIsDirty(true);
      } else {
        error = 'Please provide a valid date';
      }
      if (!nextPage) {
        error = 'Please provide a valid future separation date';
      }
    }
    setErrorMessage(error);
  };

  return (
    <div id={pageNames.bdd} className="clearfix vads-u-margin-top--2">
      <VaDate
        label={label}
        onDateChange={onChange}
        name="discharge-date"
        value={state}
        error={errorMessage}
        aria-describedby={ariaDescribedby}
      />
    </div>
  );
};

export default {
  name: pageNames.bdd,
  component: BDDPage,
};
