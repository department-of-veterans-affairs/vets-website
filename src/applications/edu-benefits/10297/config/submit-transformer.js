import {
  getLTSCountryCode,
  getTransformIntlPhoneNumber,
  dateSigned,
} from '../helpers';

const trimObjectValuesWhiteSpace = (key, value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
};

export function transform(_formConfig, form) {
  const { data } = form;

  // Extract applicant name
  const applicantFullName = data?.applicantFullName || {};

  // Extract mailing address
  const mailingAddress = data?.mailingAddress || {};

  // Extract contact info
  const contactInfo = data?.contactInfo || {};

  // Build training providers array
  const trainingProviders = (data?.trainingProviders || []).map(provider => ({
    providerName: provider?.providerName,
    providerAddress: {
      street: provider?.providerAddress?.street,
      city: provider?.providerAddress?.city,
      state: provider?.providerAddress?.state,
      postalCode: provider?.providerAddress?.postalCode,
      country: getLTSCountryCode(provider?.providerAddress?.country),
    },
  }));

  // Build the payload
  const payload = {
    formId: form?.formId,
    '@type': 'vettec',
    claimant: {
      claimantId: data?.claimantId,
      firstName: applicantFullName?.first,
      lastName: applicantFullName?.last,
      middleName: applicantFullName?.middle,
      suffix: applicantFullName?.suffix,
      dateOfBirth: data?.dateOfBirth,
      contactInfo: {
        addressLine1: mailingAddress?.street,
        addressLine2: mailingAddress?.street2,
        city: mailingAddress?.city,
        stateCode: mailingAddress?.state,
        zipcode: mailingAddress?.postalCode,
        countryCode: getLTSCountryCode(mailingAddress?.country),
        emailAddress: contactInfo?.email?.toLowerCase(),
        mobilePhoneNumber: getTransformIntlPhoneNumber(
          contactInfo?.mobilePhone,
        ),
        homePhoneNumber: getTransformIntlPhoneNumber(contactInfo?.homePhone),
      },
    },
    militaryInfo: {
      dateReleasedFromActiveDuty: data?.dateReleasedFromActiveDuty,
      activeDutyDuringHitechVets: data?.activeDutyDuringHitechVets,
    },
    directDeposit: {
      directDepositAccountType: data?.bankAccount?.accountType?.toLowerCase(),
      directDepositAccountNumber: data?.bankAccount?.accountNumber,
      directDepositRoutingNumber: data?.bankAccount?.routingNumber,
    },
    trainingProviders: {
      providers: trainingProviders,
      plannedStartDate: data?.plannedStartDate || null,
    },
    employmentInfo: {
      isEmployed: data?.isEmployed || false,
      isInTechnologyIndustry: data?.isInTechnologyIndustry || false,
      currentOccupation: data?.currentOccupation,
      currentAnnualSalary: data?.currentAnnualSalary,
      highestEducationLevel: data?.highestEducationLevel,
    },
    attestationAgreementAccepted: data?.privacyAgreementAccepted || false,
    dateSigned: dateSigned(),
  };

  return JSON.stringify(payload, trimObjectValuesWhiteSpace, 4);
}
