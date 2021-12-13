import React from 'react';
import moment from 'moment';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';

export const mcpFeatureToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showMedicalCopays];

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};

export const formatTableData = tableData =>
  tableData.map(row => ({
    date: row.date,
    desc: <strong>{row.desc}</strong>,
    amount: currency(row.amount),
  }));

export const formatDate = date => {
  return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
};

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

export const sortStatementsByDate = statements => {
  return statements.sort((a, b) => {
    const aDate = formatDate(a.pSStatementDate);
    const bDate = formatDate(b.pSStatementDate);

    if (aDate > bDate) {
      return 1;
    }

    if (aDate < bDate) {
      return -1;
    }

    return 0;
  });
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
