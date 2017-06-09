import moment from 'moment';

export function formatDateLong(date) {
  return moment(date).format('MMMM DD, YYYY');
}

export function formatDateShort(date) {
  return moment(date).format('MM/DD/YYYY');
}

export function formatPercent(percent) {
  let validPercent = undefined;

  if (!isNaN(parseInt(percent, 10))) {
    validPercent = `${Math.round(percent)}%`;
  }

  return validPercent;
}
