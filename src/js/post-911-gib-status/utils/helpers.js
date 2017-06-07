import moment from 'moment';

export function getDateFormatted(date) {
  return moment(date).format('MM/DD/YYYY');
}

export function getPercentFormatted(percent) {
  let validPercent = undefined;

  if (!isNaN(parseInt(percent, 10))) {
    validPercent = `${Math.round(percent * 100)}%`;
  }

  return validPercent;
}
