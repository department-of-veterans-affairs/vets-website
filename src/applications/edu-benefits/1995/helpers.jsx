// 1995-STEM related
export const isEdithNourseRogersScholarship = form =>
  form.isEdithNourseRogersScholarship;

export const isEligibleForEdithNourseRogersScholarship = form =>
  form.benefit === 'chapter33' &&
  form.isEdithNourseRogersScholarship &&
  (form['view:exhaustionOfBenefits'] ||
    form['view:exhaustionOfBenefitsAfterPursuingTeachingCert']) &&
  (form.isEnrolledStem || form.isPursuingTeachingCert);

export const displayStemEligibility = form =>
  isEdithNourseRogersScholarship(form) &&
  !isEligibleForEdithNourseRogersScholarship(form);

export const displayActiveDuty = form =>
  isEdithNourseRogersScholarship(form) &&
  isEligibleForEdithNourseRogersScholarship(form);
