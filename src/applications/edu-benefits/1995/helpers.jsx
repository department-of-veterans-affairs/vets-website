// 1995-STEM related
export const isEdithNourseRogersScholarship = form =>
  form.isEdithNourseRogersScholarship;

export const isChapter33 = form =>
  form.benefit === 'chapter33' || form.benefit === 'fryScholarship';

export const isEligibleForEdithNourseRogersScholarship = form =>
  isChapter33(form) &&
  isEdithNourseRogersScholarship(form) &&
  (form['view:exhaustionOfBenefits'] ||
    form['view:exhaustionOfBenefitsAfterPursuingTeachingCert']) &&
  (form.isEnrolledStem || form.isPursuingTeachingCert);

export const displayStemEligibility = form =>
  isEdithNourseRogersScholarship(form) &&
  !isEligibleForEdithNourseRogersScholarship(form);

export const displayActiveDuty = form =>
  isEdithNourseRogersScholarship(form) &&
  isEligibleForEdithNourseRogersScholarship(form);
