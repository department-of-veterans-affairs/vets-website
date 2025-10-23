import moment from 'moment';

export const dateTemplate = 'YYYY-MM-DD';

export const maxDate = moment().add(100, 'year');
export const getDate = date => moment(date, dateTemplate);
export const isDateComplete = date => date?.length === dateTemplate.length;
export const isDateInFuture = date => date?.diff(moment()) > 0;
export const isDateLessThanMax = date => date?.isBefore(maxDate);

export const isValidDate = date => {
  if (date && isDateComplete(date)) {
    const dateObj = getDate(date);
    return isDateInFuture(dateObj) && isDateLessThanMax(dateObj);
  }
  return false;
};

export const getDiffInDays = date => {
  const dateDischarge = moment(date, dateTemplate);
  const dateToday = moment();
  return dateDischarge.diff(dateToday, 'days');
};
