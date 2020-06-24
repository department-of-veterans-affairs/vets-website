export const isChapter33 = form =>
  form.benefit === 'chapter33' || form.benefit === 'fryScholarship';

export const displayConfirmEligibility = form =>
  !isChapter33(form) ||
  (!form.isEnrolledStem && !form.isPursuingTeachingCert) ||
  form.benefitLeft === 'moreThanSixMonths';
