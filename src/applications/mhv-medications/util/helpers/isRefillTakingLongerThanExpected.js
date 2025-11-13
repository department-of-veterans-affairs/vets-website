import { dispStatusObj } from '../constants';

/**
 * @param {Object} rx prescription object
 * @returns {Boolean}
 */
export const isRefillTakingLongerThanExpected = rx => {
  if (!rx) {
    return false;
  }

  let { refillDate } = rx;
  let { refillSubmitDate } = rx;

  if (Array.isArray(rx.rxRfRecords) && rx.rxRfRecords.length > 0) {
    refillDate = refillDate || rx.rxRfRecords[0]?.refillDate;
    refillSubmitDate = refillSubmitDate || rx.rxRfRecords[0]?.refillSubmitDate;
  }

  if (!refillDate && !refillSubmitDate) {
    return false;
  }

  const sevenDaysAgoDate = new Date().setDate(new Date().getDate() - 7);

  return (
    (rx.dispStatus === dispStatusObj.refillinprocess &&
      refillDate &&
      Date.now() > Date.parse(refillDate)) ||
    (rx.dispStatus === dispStatusObj.submitted &&
      refillSubmitDate &&
      Date.parse(refillSubmitDate) < sevenDaysAgoDate)
  );
};
