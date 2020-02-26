// 1995-STEM related
import environment from 'platform/utilities/environment';

const isEdithNourseRogersScholarship = form =>
  form.isEdithNourseRogersScholarship;

export const isChapter33 = form =>
  form.benefit === 'chapter33' || form.benefit === 'fryScholarship';

const isEligibleForEdithNourseRogersScholarship = form =>
  isChapter33(form) &&
  isEdithNourseRogersScholarship(form) &&
  (form['view:exhaustionOfBenefits'] ||
    form['view:exhaustionOfBenefitsAfterPursuingTeachingCert']) &&
  (form.isEnrolledStem || form.isPursuingTeachingCert);

export const displayStemEligibility = form =>
  isEdithNourseRogersScholarship(form) &&
  !isEligibleForEdithNourseRogersScholarship(form);

const determineEligibilityFor1995Stem = form =>
  form['view:determineEligibility']['view:determineEligibility'];

export const display1995StemFlow = form =>
  environment.isProduction()
    ? isEdithNourseRogersScholarship(form)
    : isEdithNourseRogersScholarship(form) &&
      (isEligibleForEdithNourseRogersScholarship(form) ||
        determineEligibilityFor1995Stem(form));
