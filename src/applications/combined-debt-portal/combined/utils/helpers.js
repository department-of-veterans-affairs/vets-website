import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/feature-toggles/selectors';
import { addDays, format, isBefore, isEqual, isValid } from 'date-fns';
import { getMedicalCenterNameByID } from '@department-of-veterans-affairs/platform-utilities/medical-centers';
import React from 'react';
import { templates } from '@department-of-veterans-affairs/platform-pdf/exports';
import * as Sentry from '@sentry/browser';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

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

/**
 * Helper function to consisently format date strings
 *
 * @param {string} date - date string or date type
 * @returns formatted date string; example:
 * - January 1, 2021
 */
export const formatDate = date => {
  const newDate =
    typeof date === 'string' ? new Date(date.replace(/-/g, '/')) : date;
  return isValid(newDate) ? format(new Date(newDate), 'MMMM d, y') : '';
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};

export const cdpAccessToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const formatTableData = tableData =>
  tableData.map(row => ({
    date: row.date,
    desc: <strong>{row.desc}</strong>,
    amount: currency(row.amount),
  }));

export const calcDueDate = (date, days) => {
  return formatDate(addDays(new Date(date), days));
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
  const currentDate = new Date();
  const dueDate = calcDueDate(date, 30);
  return (
    isBefore(currentDate, new Date(dueDate)) ||
    isEqual(currentDate, new Date(dueDate))
  );
};

export const sortStatementsByDate = statements => {
  return statements.sort(
    (a, b) =>
      new Date(b.pSStatementDateOutput) - new Date(a.pSStatementDateOutput),
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

// 'Manually' generating PDF instead of using generatePdf so we can
//  get the blob and send it to the API to combine with the Notice of Rights PDF
//  may just be a temporary solution until we can get all the content displaying in a reasonable way
const getPdfBlob = async (templateId, data) => {
  const template = templates[templateId]();
  const doc = await template.generate(data);

  const chunks = [];
  return new Promise((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const blob = new Blob([Buffer.concat(chunks)], {
        type: 'application/pdf',
      });
      resolve(blob);
    });
    doc.on('error', reject);
    doc.end();
  });
};

const pdfGenerationAnalytics = (success, count) => {
  recordEvent({
    event: 'cdp-one-va-letter-download',
    'cdp-one-va-letter-download-success': success,
    'cdp-one-va-letter-download-count-debt': count?.debt || 0,
    'cdp-one-va-letter-download-count-copay': count?.copay || 0,
  });
};

// some fancy PDF generation
export const handlePdfGeneration = async (environment, pdfData) => {
  const analyticsCount = {
    debt: pdfData?.debts?.length || 0,
    copay: pdfData?.copays?.length || 0,
  };

  try {
    const blob = await getPdfBlob('oneDebtLetter', pdfData);

    const file = new File([blob], 'one_debt_letter.pdf', {
      type: 'application/pdf',
    });

    const formData = new FormData();
    formData.append('document', file);

    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${environment.API_URL}/debts_api/v0/combine_one_debt_letter_pdf`,
    );
    xhr.responseType = 'blob';

    xhr.setRequestHeader('X-Key-Inflection', 'camel');
    xhr.setRequestHeader('X-CSRF-Token', localStorage.getItem('csrfToken'));
    xhr.setRequestHeader('Source-App-Name', window.appName);
    xhr.withCredentials = true;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const filename = `one_debt_letter_${
          new Date().toISOString().split('T')[0]
        }.pdf`;

        const url = URL.createObjectURL(xhr.response);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        pdfGenerationAnalytics(false, analyticsCount);
        Sentry.captureMessage(
          `OneDebtLetter - PDF request failed: ${xhr.status}`,
        );
      }
    };

    xhr.onerror = () => {
      pdfGenerationAnalytics(false, analyticsCount);
      Sentry.captureMessage(`OneDebtLetter - Network error during PDF request`);
    };

    xhr.send(formData);
    pdfGenerationAnalytics(true, analyticsCount);
  } catch (err) {
    pdfGenerationAnalytics(false, analyticsCount);
    Sentry.setExtra('error: ', err);
    Sentry.captureMessage(
      `OneDebtLetter - PDF generation failed: ${err.message}`,
    );
  }
};
