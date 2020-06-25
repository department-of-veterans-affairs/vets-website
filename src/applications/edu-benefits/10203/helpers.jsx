export const isChapter33 = form =>
  !!form['view:benefit']?.chapter33 || !!form['view:benefit']?.fryScholarship;

export const displayConfirmEligibility = form =>
  !isChapter33(form) ||
  (!form.isEnrolledStem && !form.isPursuingTeachingCert) ||
  form.benefitLeft === 'moreThanSixMonths';
