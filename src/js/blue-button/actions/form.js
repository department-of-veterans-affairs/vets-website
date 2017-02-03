export function changeDate(date, start = true) {
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

export function toggleReportType(reportType) {
  return {
    type: 'REPORT_TYPE_TOGGLED',
    reportType,
  };
}

export function toggleAllReports(checked = true) {
  return {
    type: 'ALL_REPORTS_TOGGLED',
    checked,
  };
}
