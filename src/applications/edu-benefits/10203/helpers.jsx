// 1995-STEM related
const isEdithNourseRogersScholarship = form =>
  form.isEdithNourseRogersScholarship;

export const isChapter33 = form =>
  form.benefit === 'chapter33' || form.benefit === 'fryScholarship';

const isEligibleForEdithNourseRogersScholarship = form =>
  (isChapter33(form) || form.benefit === undefined) &&
  isEdithNourseRogersScholarship(form) &&
  (form['view:exhaustionOfBenefits'] ||
    form['view:exhaustionOfBenefitsAfterPursuingTeachingCert']) &&
  (form.isEnrolledStem || form.isPursuingTeachingCert);

export const displayStemEligibility = form =>
  isEdithNourseRogersScholarship(form) &&
  !isEligibleForEdithNourseRogersScholarship(form);

export const determineEligibilityFor1995Stem = form =>
  form['view:determineEligibility']['view:determineEligibility'];

export const display1995StemFlow = form =>
  isEdithNourseRogersScholarship(form) &&
  (isEligibleForEdithNourseRogersScholarship(form) ||
    determineEligibilityFor1995Stem(form));

export const display10203StemFlow = form =>
  isEdithNourseRogersScholarship(form) &&
  (isEligibleForEdithNourseRogersScholarship(form) ||
    determineEligibilityFor1995Stem(form));
