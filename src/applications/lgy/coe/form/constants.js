// VA loan numbers are _always_ 12 digits (no dashes or spaces), according
// to SME responses, see:
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/45026#issuecomment-1235860405
export const LOAN_NUMBER_DIGIT_LENGTH = 12;
export const NON_DIGIT_REGEX = /[^\d]/g;
