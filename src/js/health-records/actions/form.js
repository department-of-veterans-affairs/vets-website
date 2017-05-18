import { apiRequest } from '../utils/helpers';
import moment from 'moment';

function getDataClasses(formData) {
  return Object.keys(formData.reportTypes).filter((reportType) => {
    return formData.reportTypes[reportType];
  });
}

function getFromDate(formData) {
  let fromDate = moment();
  if (formData.dateOption === '3mo') {
    fromDate = fromDate.subtract(3, 'months');
  } else if (formData.dateOption === '6mo') {
    fromDate = fromDate.subtract(6, 'months');
  } else if (formData.dateOption === '1yr') {
    fromDate = fromDate.subtract(1, 'years');
  } else if (formData.dateOption === 'custom') {
    fromDate = moment(formData.dateRange.start);
  }
  return fromDate.toISOString();
}

function getToDate(formData) {
  let toDate = moment();
  if (formData.dateOption === 'custom') {
    toDate = moment(formData.dateRange.end);
  }
  return toDate.toISOString();
}

export function setDate(date, start = true) {
  return {
    type: start ? 'START_DATE_CHANGED' : 'END_DATE_CHANGED',
    date,
  };
}

export function changeDateOption(dateOption) {
  return {
    type: 'DATE_OPTION_CHANGED',
    dateOption,
  };
}

export function toggleReportType(reportType, checked) {
  return {
    type: 'REPORT_TYPE_TOGGLED',
    reportType,
    checked,
  };
}

export function toggleAllReports(checked = true) {
  return {
    type: 'ALL_REPORTS_TOGGLED',
    checked,
  };
}

export function resetForm() {
  return {
    type: 'FORM_RESET',
  };
}

export function submitForm(formData) {
  return (dispatch) => {
    window.dataLayer.push({
      event: 'health-record-request',
    });

    dispatch({ type: 'FORM_SUBMITTING' });

    apiRequest('/v0/health_records',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          dataClasses: getDataClasses(formData),
          fromDate: getFromDate(formData),
          toDate: getToDate(formData)
        })
      },
      () => dispatch({
        type: 'FORM_SUCCESS'
      }),
      () => dispatch({
        type: 'FORM_FAILURE'
      })
    );
  };
}
