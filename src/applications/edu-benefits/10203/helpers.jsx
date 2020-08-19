export const isChapter33 = form =>
  !!form['view:benefit']?.chapter33 || !!form['view:benefit']?.fryScholarship;

const onReviewAndSubmitPage = () => {
  return (
    window.location.pathname.split('/').slice(-1)[0] === 'review-and-submit'
  );
};

export const displayConfirmEligibility = form =>
  !isChapter33(form) ||
  (!form.isEnrolledStem && !form.isPursuingTeachingCert) ||
  form.benefitLeft === 'moreThanSixMonths' ||
  onReviewAndSubmitPage();
