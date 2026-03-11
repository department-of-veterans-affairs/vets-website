/*
 * Saving this action from a discussion on the Confirmation page PR.
 * You can paste this into Redux DevTools and then dispatch it to fill
 * out the form and see how the Confirmation page is meant to look
 * when you don't have a true response coming through.
 */

export default {
  type: 'SET_DATA',
  data: {
    files2: [
      {
        name: 'test-file.png',
        size: 6892,
        confirmationCode: '5',
        isEncrypted: false,
        type: 'image/png',
        additionalData: {
          attachmentType: 'Discharge papers (DD214)',
        },
      },
    ],
    loanHistory: {
      hadPriorLoans: false,
      certificateUse: 'ENTITLEMENT_INQUIRY_ONLY',
    },
    'view:optionsAccordion': {},
    'view:periodsOfServiceMissingInformation': {},
    'view:hasServicePeriods': false,
    militaryHistory: {
      separatedDueToDisability: true,
    },
    identity: 'VETERAN',
    veteran: {
      mailingAddress: {
        addressLine1: '1200 Park Ave',
        addressLine2: 'c/o Pixar',
        addressLine3: '',
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        city: 'Emeryville',
        countryName: 'United States',
        countryCodeIso2: 'US',
        countryCodeIso3: 'USA',
        countryCodeFips: '',
        countyCode: '',
        countyName: '',
        createdAt: '2020-05-30T03:57:20.000+00:00',
        effectiveEndDate: '',
        effectiveStartDate: '2020-07-10T20:10:45.000+00:00',
        id: 173917,
        internationalPostalCode: '',
        province: '',
        sourceDate: '2020-07-10T20:10:45.000+00:00',
        sourceSystemUser: '',
        stateCode: 'CA',
        transactionId: '7139aa82-fd06-45ea-a217-9654869924bd',
        updatedAt: '2020-07-10T20:10:46.000+00:00',
        validationKey: '',
        vet360Id: '1273780',
        zipCode: '94608',
        zipCodeSuffix: '',
      },
      homePhone: {
        areaCode: '503',
        countryCode: '1',
        phoneNumber: '2222222',
      },
      email: {
        emailAddress: 'test@user.com',
      },
      undefined: {
        areaCode: '510',
        countryCode: '1',
        createdAt: '2020-06-12T16:56:37.000+00:00',
        extension: '17477',
        effectiveEndDate: '',
        effectiveStartDate: '2020-07-14T19:07:45.000+00:00',
        id: 146766,
        isInternational: false,
        isTextable: '',
        isTextPermitted: '',
        isTty: '',
        isVoicemailable: '',
        phoneNumber: '9223000',
        phoneType: 'HOME',
        sourceDate: '2020-07-14T19:07:45.000+00:00',
        sourceSystemUser: '',
        transactionId: '92c49d39-22b2-4bd6-92b4-0b7e7c63c6a9',
        updatedAt: '2020-07-14T19:07:46.000+00:00',
        vet360Id: '1273780',
      },
    },
    fullName: {},
    applicantAddress: {
      country: 'USA',
      'view:militaryBaseDescription': {},
    },
    'view:preDischargeClaimAdditionalInfo': {},
    'view:preDischargeClaimWhyAccordion': {},
    'view:purpleHeartWhyAccordion': {},
    periodsOfService: [
      {
        serviceBranch: 'AF',
        dateRange: {
          from: '2000-01-01',
          to: '2001-01-01',
        },
      },
    ],
    'view:documentRequirements': {},
    'view:documentUploadDescription': {},
    'view:coeFormRebuildCveteam': true,
  },
};
