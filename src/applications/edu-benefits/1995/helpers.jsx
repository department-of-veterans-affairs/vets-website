import environment from 'platform/utilities/environment';

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
  environment.isProduction() &&
  form['view:determineEligibility']['view:determineEligibility'];

export const display1995StemFlow = form =>
  environment.isProduction() &&
  isEdithNourseRogersScholarship(form) &&
  (isEligibleForEdithNourseRogersScholarship(form) ||
    determineEligibilityFor1995Stem(form));

export const buildSubmitEventData = formData => {
  if (environment.isProduction()) {
    const exhaustedAllBenefits =
      formData['view:exhaustionOfBenefits'] === true ||
      formData['view:exhaustionOfBenefitsAfterPursuingTeachingCert'] === true;
    return {
      benefitsUsedRecently: formData.benefit,
      'edu-stemApplicant': formData.isEdithNourseRogersScholarship
        ? 'Yes'
        : 'No',
      'edu-undergradStem': formData.isEnrolledStem ? 'Yes' : 'No',
      'edu-pursueTeaching': formData.isPursuingTeachingCert ? 'Yes' : 'No',
      activeDuty: formData.isActiveDuty ? 'Yes' : 'No',
      calledActiveDuty: formData.isActiveDuty ? 'Yes' : 'No',
      preferredContactMethod: formData.preferredContactMethod,
      'edu-exhaustedAllBenefits': exhaustedAllBenefits ? 'Yes' : 'No',
    };
  }

  const yesNoOrUndefined = value => {
    if (value === undefined) {
      return undefined;
    }
    return value ? 'Yes' : 'No';
  };

  return {
    'benefits-used-recently': formData.benefit,
    'new-service-periods-to-record': yesNoOrUndefined(
      formData['view:newService'],
    ),
    'service-details': (formData.toursOfDuty || []).map(tour => ({
      'service-branch': tour.serviceBranch,
      'service-start-date': tour.dateRange.from,
      'service-end-date': tour.dateRange.to,
    })),
    'service-before-1978': yesNoOrUndefined(
      formData['view:hasServiceBefore1978'],
    ),
    'edu-desired-facility-name': formData.newSchoolName,
    'edu-desired-type-of-education': formData.educationType,
    'edu-desired-facility-state': formData.newSchoolAddress.state,
    'edu-desired-facility-city': formData.newSchoolAddress.city,
    'edu-prior-facility-name': formData.oldSchool.name,
    'edu-prior-facility-state': formData.oldSchool.address.state,
    'edu-prior-facility-city': formData.oldSchool.address.city,
    'edu-prior-facility-end-date': formData.trainingEndDate,
    'preferred-contact-method': formData.preferredContactMethod,
    married: yesNoOrUndefined(formData.serviceBefore1977.married),
    'dependent-children': yesNoOrUndefined(
      formData.serviceBefore1977.haveDependents,
    ),
    'dependent-parent': yesNoOrUndefined(
      formData.serviceBefore1977.parentDependent,
    ),
    'direct-deposit-method': formData.bankAccountChange,
    'direct-deposit-account-type': formData.bankAccount?.accountType,
  };
};
