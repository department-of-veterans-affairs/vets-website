export const buildSubmitEventData = formData => {
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
    'edu-desired-facility-name': formData.newSchoolName,
    'edu-desired-type-of-education': formData.educationType,
    'edu-desired-facility-state': formData.newSchoolAddress?.state,
    'edu-desired-facility-city': formData.newSchoolAddress?.city,
    'edu-prior-facility-name': formData.oldSchool?.name,
    'edu-prior-facility-state': formData.oldSchool?.address.state,
    'edu-prior-facility-city': formData.oldSchool?.address.city,
    'edu-prior-facility-end-date': formData.trainingEndDate,
    'preferred-contact-method': formData.preferredContactMethod,
    'direct-deposit-method': formData.bankAccountChange,
    'direct-deposit-account-type': formData.bankAccount?.accountType,
  };
};
