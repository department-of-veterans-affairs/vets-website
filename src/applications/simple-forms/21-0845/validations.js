import moment from 'moment';

export const releaseEndDateValidation = (errors = {}, fieldData, formData) => {
  const endDate = moment(formData.releaseEndDate, 'YYYY-MM-DD');
  const endOfToday = moment().endOf('day');
  const earliestValidEndDateString = moment()
    .startOf('day')
    .add(1, 'days')
    .format('MMMM D YYYY');

  if (endDate.isBefore(endOfToday)) {
    errors.addError(
      `Please provide a future date: ${earliestValidEndDateString} or later`,
    );
  }
};
