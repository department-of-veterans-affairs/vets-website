import environment from 'platform/utilities/environment';

export const isProductionOfTestProdEnv = automatedTest => {
  return (
    environment.isProduction() ||
    automatedTest ||
    (global && global?.window && global?.window?.buildType)
  );
};

export const directDepositMethod = (formData, automatedTest = false) => {
  return isProductionOfTestProdEnv(automatedTest)
    ? formData.bankAccountChange
    : formData.bankAccountChangeUpdate;
};

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
    'service-before-1978': yesNoOrUndefined(
      formData['view:hasServiceBefore1978'],
    ),
    'edu-desired-facility-name': formData.newSchoolName,
    'edu-desired-type-of-education': formData.educationType,
    'edu-desired-facility-state': formData.newSchoolAddress?.state,
    'edu-desired-facility-city': formData.newSchoolAddress?.city,
    'edu-prior-facility-name': formData.oldSchool?.name,
    'edu-prior-facility-state': formData.oldSchool?.address.state,
    'edu-prior-facility-city': formData.oldSchool?.address.city,
    'edu-prior-facility-end-date': formData.trainingEndDate,
    'preferred-contact-method': formData.preferredContactMethod,
    married: yesNoOrUndefined(formData.serviceBefore1977?.married),
    'dependent-children': yesNoOrUndefined(
      formData.serviceBefore1977?.haveDependents,
    ),
    'dependent-parent': yesNoOrUndefined(
      formData.serviceBefore1977?.parentDependent,
    ),
    'direct-deposit-method': directDepositMethod(formData),
    'direct-deposit-account-type': formData.bankAccount?.accountType,
  };
};
