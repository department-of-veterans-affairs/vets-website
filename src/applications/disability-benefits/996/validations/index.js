import { isValidDate } from '../helpers';
import { errorMessages } from '../constants';

export const checkDateRange = (errors, { from = '', to = '' } = {}) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // From & to may be empty initially
  if (isValidDate(fromDate)) {
    const fromTime = fromDate.getTime();
    if (fromTime < Date.now()) {
      errors.from.addError(errorMessages.startDateInPast);
    } else if (isValidDate(toDate) && toDate.getTime() <= fromTime) {
      errors.to.addError(errorMessages.endDateBeforeStart);
    }
  }
};
