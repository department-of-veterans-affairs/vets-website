import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

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

export const determineEligibilityFor10203Stem = form =>
  form['view:determineEligibility']['view:determineEligibility'];

export const display10203StemFlow = form =>
  isEdithNourseRogersScholarship(form) &&
  (isEligibleForEdithNourseRogersScholarship(form) ||
    determineEligibilityFor10203Stem(form));

export const MGIBAlert = () => {
  const text = (
    <div>
      <p>
        The Rogers STEM Scholarship is only for Post-9/11 Gi Bill and Fry
        Scholarship recipients.
      </p>
      <p>
        If you think you may be eligible, you can still choose to apply for the
        Rogers STEM Scholarship
      </p>
    </div>
  );
  return (
    <AlertBox
      status="warning"
      headline="You may not be eligible"
      content={text}
    />
  );
};
