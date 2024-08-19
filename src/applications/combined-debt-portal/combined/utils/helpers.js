import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { format } from 'date-fns';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import moment from 'moment';
import React from 'react';

export const APP_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});

export const ALERT_TYPES = Object.freeze({
  ALL_ERROR: 'ALL_ERROR',
  ALL_ZERO: 'ALL_ZERO',
  ERROR: 'ERROR',
  ZERO: 'ZERO',
});

export const API_RESPONSES = Object.freeze({
  ERROR: -1,
});

export const combinedPortalAccess = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const debtLettersShowLettersVBMS = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.debtLettersShowLettersVBMS];

export const showPaymentHistory = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.CdpPaymentHistoryVba];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;

export const formatDate = date => {
  return format(new Date(date), 'MMMM d, yyyy');
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};

export const mcpFeatureToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showMedicalCopays];

export const cdpAccessToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const formatTableData = tableData =>
  tableData.map(row => ({
    date: row.date,
    desc: <strong>{row.desc}</strong>,
    amount: currency(row.amount),
  }));

export const calcDueDate = (date, days) => {
  return moment(date, 'MM-DD-YYYY')
    .add(days, 'days')
    .format('MMMM D, YYYY');
};

export const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// if currentDate is on or before dueDate show current status
// else show past due status
export const verifyCurrentBalance = date => {
  const currentDate = moment();
  const dueDate = calcDueDate(date, 30);
  return currentDate.isSameOrBefore(dueDate);
};

// receiving formatted date strings in the response
// so we need to convert back to moment before sorting
export const sortStatementsByDate = statements => {
  const dateFormat = 'MM-DD-YYYY';
  return statements.sort(
    (a, b) =>
      moment(b.pSStatementDate, dateFormat) -
      moment(a.pSStatementDate, dateFormat),
  );
};

export const transform = data => {
  return data.map(statement => {
    const { station } = statement;
    const facilityName = getMedicalCenterNameByID(station.facilitYNum);
    const city = titleCase(station.city);

    return {
      ...statement,
      station: {
        ...station,
        facilityName,
        city,
      },
    };
  });
};

export const setPageFocus = selector => {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  } else {
    document.querySelector('#main h1').setAttribute('tabIndex', -1);
    document.querySelector('#main h1').focus();
  }
};
