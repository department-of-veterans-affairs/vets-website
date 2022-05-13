import PropTypes from 'prop-types';
import {
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';
import {
  CERTIFICATION_METHOD,
  PAYMENT_PAUSED_DAY_OF_MONTH,
  STATUS,
  VERIFICATION_RESPONSE,
} from '../constants';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const ENROLLMENTS_TYPE = PropTypes.arrayOf(
  PropTypes.shape({
    facilityName: PropTypes.string.isRequired,
    totalCreditHours: PropTypes.number.isRequired,
    beginDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }),
);
export const MONTH_PROP_TYPE = PropTypes.shape({
  certifiedBeginDate: PropTypes.string.isRequired,
  certifiedEndDate: PropTypes.string.isRequired,
  enrollments: ENROLLMENTS_TYPE,
  verificationResponse: PropTypes.string.isRequired,
  verificationMonth: PropTypes.string.isRequired,
});

export const ENROLLMENT_VERIFICATION_TYPE = PropTypes.shape({
  claimantId: PropTypes.number,
  enrollmentVerifications: PropTypes.arrayOf(MONTH_PROP_TYPE),
  lastCertifiedThroughDate: PropTypes.string,
  paymentOnHold: PropTypes.bool.isRequired,
});

export const STATUS_PROP_TYPE = PropTypes.oneOf([
  STATUS.ALL_VERIFIED,
  STATUS.MISSING_VERIFICATION,
  STATUS.PAYMENT_PAUSED,
  STATUS.SCO_PAUSED,
]);

export const formatNumericalDate = rawDate => {
  let date;

  if (rawDate) {
    const dateParts = rawDate.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export const formatReadableMonthYear = rawDate => {
  if (!rawDate) {
    return '';
  }

  const dateParts = rawDate.split('-');
  const date = new Date(
    Number.parseInt(dateParts[0], 10),
    Number.parseInt(dateParts[1], 10) - 1,
    1,
  );

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Converts a number to a string, preserving a minimum number of integer
 * digits.
 * Examples:
 * (5, 0) => '5'
 * (5, 1) => '5'
 * (5, 2) => '05'
 * (5, 3) => '005'
 * (2022, 2) => '2022'
 * (2022, 5) => '02022'
 * (3.14159, 1) => '3.14159'
 * (3.14159, 2) => '03.14159'
 * (3.14159, 3) => '003.14159'
 * @param {number} n The number we want to convert.
 * @param {number} minDigits The minimum number of integer digits to preserve.
 * @returns {string} The number formatted as a string.
 */
export const convertNumberToStringWithMinimumDigits = (n, minDigits) => {
  return n.toLocaleString('en-US', {
    minimumIntegerDigits: minDigits,
    useGrouping: false,
  });
};

/**
 * Given a date in UTC format, determine if the current date is after
 * the "paused" day of the month following the given date.
 *
 * For example (given PAYMENT_PAUSED_DATE_OF_MONTH = 25):
 * * if today is 2022-02-24 and the given date is 2022-01-01,
 *   return false;
 * * if today is 2022-02-25 and the given date is 2022-01-01,
 *   return true;
 * * if today is 2022-02-25 and the given date is 2022-02-01,
 *   return false;
 *
 * @param {string} date
 */
export const nowAfterPausedDateOfFollowingMonth = date => {
  const now = new Date().toISOString();

  if (now <= date) {
    return false;
  }

  const dateSplit = date.split('-');
  dateSplit[1] = (parseInt(dateSplit[1], 10) % 12) + 1;
  if (dateSplit[1] === 1) {
    // If we rolled over to a near year, increment the year.
    dateSplit[0] += 1;
  }
  dateSplit[1] = convertNumberToStringWithMinimumDigits(dateSplit[1], 2);
  dateSplit[2] = convertNumberToStringWithMinimumDigits(
    PAYMENT_PAUSED_DAY_OF_MONTH,
    2,
  );

  return now >= dateSplit.join('-');
};

function monthlyPaymentsPaused(unverifiedMonths) {
  const earliestUnverifiedMonth = unverifiedMonths.reduce(
    (prev, current) =>
      prev.certifiedEndDate < current.certifiedEndDate ? prev : current,
  );

  return nowAfterPausedDateOfFollowingMonth(
    earliestUnverifiedMonth.certifiedEndDate,
  );
}

export const getEnrollmentVerificationStatus = status => {
  if (status?.paymentOnHold) {
    return STATUS.SCO_PAUSED;
  }

  const unverifiedMonths = status?.enrollmentVerifications?.filter(
    month => month.verificationResponse === VERIFICATION_RESPONSE.NOT_RESPONDED,
  );

  if (!unverifiedMonths.length) {
    return STATUS.ALL_VERIFIED;
  }

  return monthlyPaymentsPaused(unverifiedMonths)
    ? STATUS.PAYMENT_PAUSED
    : STATUS.MISSING_VERIFICATION;
};

/**
 * Create an Enrollment Verification DTO to submit to the server.
 * @param {object} ev The original EV object we recieved when
 * the application loaded.
 * @param {number} evIndex The index of the enrollment to reference.
 * @param {string} status The status of the enrollment.
 * @returns An Enrollment Verification DTO.
 */
const mapEnrollmentVerificationForSubmission = (ev, evIndex, status) => {
  const enrollmentVerification = ev.enrollmentVerifications[evIndex];
  return {
    claimandId: ev.claimantId,
    enrolmentCertifyRequests: [
      {
        claimandId: ev.claimantId,
        certifiedBeginDate: enrollmentVerification.certifiedBeginDate,
        certifiedEndDate: enrollmentVerification.certifiedEndDate,
        certifiedThroughDate: enrollmentVerification.certifiedEndDate,
        certificationMethod: CERTIFICATION_METHOD,
        appCommunication: {
          responseType: status,
        },
      },
    ],
  };
};

/**
 * Given the initial Enrollment Verification object we recieved, format
 * a transfer object to send when the finalized verification is
 * submitted.  Note that months must be verified in sequential order
 * from oldest to most recent and if any month is marked as invalid, no
 * further validation for future months can occur until a School
 * Certifying Official corrects the issue.
 *
 * The back-end is expecting an array of objects.  However, it is not
 * expecting an object per enrollemnt period, rather, it expects one
 * enrollment per status. When multiple months are marked as valid,
 * one object with _the most recent enrollment_ information used for the
 * end/through date is expected.  If some months are marked as valid and
 * a later month is marked as invalid, two objects would be send: one
 * for the valid month(s) and one for the invalid month.
 *
 * So, in the case where The Veteran is sumitting a verification for 3
 * months (e.g. January, February, and March) and the first two months
 * were marked as valid, an array with two objects would be returned:
 * 1. one object with a correct response type and end/through date of
 *    2/28/2022; and
 * 2. a second object with an incorrect reaponse type and end/through
 *    date of 3/31/2022.
 *
 * Given the same 3 months, if all three were marked as correct, an
 * array of one object would be sent with a correct response type and
 * an end/thorugh date of 3/31/2022.

 * Given the same 3 months, if January were marked as correct, Febuary
 * and March would not be able to be validated an array of one object
 * would be sent with an incorrect response type and an end/thorugh
 * date of 1/31/2022.
 *
 * @param {EnrollmentVerificaiton} ev The Enrollment Verification object we
 * originally recieved, updated with the verificationStatus set when going
 * through the verification flow.
 * @returns An array of EnrollmentVerifications formatted as the back-end
 * expects.
 */
export const mapEnrollmentVerificationsForSubmission = ev => {
  // The enrollments are in order with the most recent first.  Look
  // for the first non-null verificationStatus (or, the most recent
  // month) that was verified as either correct or incorrect.
  const mostRecentVerifiedEnrollmentIndex = ev.enrollmentVerifications.findIndex(
    enrollment =>
      [VERIFICATION_STATUS_CORRECT, VERIFICATION_STATUS_INCORRECT].includes(
        enrollment.verificationStatus,
      ),
  );
  const e = ev.enrollmentVerifications[mostRecentVerifiedEnrollmentIndex];
  const enrollmentVerificationsDto = [];

  if (
    e.verificationStatus === VERIFICATION_STATUS_CORRECT ||
    (mostRecentVerifiedEnrollmentIndex <
      ev.enrollmentVerifications.length - 1 &&
      ev.enrollmentVerifications[mostRecentVerifiedEnrollmentIndex + 1]
        .verificationStatus === VERIFICATION_STATUS_CORRECT)
  ) {
    const mostRecentCorrectEnrollmentIndex =
      e.verificationStatus === VERIFICATION_STATUS_CORRECT
        ? mostRecentVerifiedEnrollmentIndex
        : mostRecentVerifiedEnrollmentIndex + 1;

    enrollmentVerificationsDto.push(
      mapEnrollmentVerificationForSubmission(
        ev,
        mostRecentCorrectEnrollmentIndex,
        VERIFICATION_RESPONSE.CORRECT,
      ),
    );
  }
  if (e.verificationStatus === VERIFICATION_STATUS_INCORRECT) {
    enrollmentVerificationsDto.push(
      mapEnrollmentVerificationForSubmission(
        ev,
        mostRecentVerifiedEnrollmentIndex,
        VERIFICATION_RESPONSE.INCORRECT,
      ),
    );
  }

  return enrollmentVerificationsDto;
};
