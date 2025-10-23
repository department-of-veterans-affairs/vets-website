import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';
import { FORM_STATUS_BDD, SAVED_SEPARATION_DATE } from '../constants';

import { getDate, isDateComplete, getDiffInDays, isValidDate } from '../utils';

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

// web-component labels only accept strings (not JSX)
const label = 'Enter a release from active duty date';

// Figure out which page to go to based on the date entered
const findNextPage = date => {
  const differenceBetweenDatesInDays = getDiffInDays(date) + 1;

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

const validate = ({ radDate }) => isValidDate(radDate);

const getNextPage = data => {
  const { radDate } = data;
  const date = isDateComplete(radDate) ? getDate(radDate) : null;
  const nextPage = date && validate({ radDate }) ? findNextPage(radDate) : null;
  return date && nextPage ? nextPage : '';
};

/**
 * RAD = Release from active duty
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const Rad = ({ data = {}, error, setPageData }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const checkValid = (value = data.radDate) => {
    if (value) {
      if (!value) {
        setErrorMessage('Please provide a valid date');
      }
      if (!validate({ radDate: value })) {
        setErrorMessage('Please provide a valid future separation date');
      }
    } else {
      setErrorMessage(null);
    }
  };

  useEffect(() => checkValid(data));

  const onChange = ({ target }) => {
    const { value } = target;
    saveDischargeDate();
    setPageData({ radDate: value });
    checkValid(value);
  };

  return (
    <div id={pageNames.rad} className="clearfix">
      <h1 className="vads-u-margin-bottom--0">
        What’s the date or anticipated date of your release from active duty?
      </h1>
      <VaDate
        label={label}
        className="vads-u-margin-top--0"
        onDateBlur={onChange}
        name="discharge-date"
        value={data.radDate}
        error={error ? errorMessage : null}
      />
    </div>
  );
};

Rad.propTypes = {
  data: PropTypes.shape({}),
  error: PropTypes.bool,
  setPageData: PropTypes.func,
};

export default {
  name: pageNames.rad,
  component: Rad,
  validate,
  back: pageNames.start,
  next: getNextPage,
};
