const mock = require('../../../../platform/testing/e2e/mock-helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeAlternateName(client, data) {
  const hasAlternateName = data['view:hasAlternateName'];

  client.selectYesNo('root_view:hasAlternateName', hasAlternateName);
  if (hasAlternateName) {
    data.alternateNames.forEach((name, i, list) => {
      const { first, middle, last } = name;
      client
        .fill(`input[name="root_alternateNames_${i}_first"]`, first)
        .fill(`input[name="root_alternateNames_${i}_middle"]`, middle)
        .fill(`input[name="root_alternateNames_${i}_last"]`, last);

      if (i < list.length - 1) client.click('.va-growable-add-btn');
    });
  }
}

function completeMilitaryRetiredPay(client, data) {
  const retiredPay = data['view:hasMilitaryRetiredPay'];

  client.selectYesNo('root_view:hasMilitaryRetiredPay', retiredPay);
  if (retiredPay) {
    client.selectDropdown(
      'root_militaryRetiredPayBranch',
      data.militaryRetiredPayBranch,
    );
  }
}

function completeCombatZonePost911(client, data) {
  const served = data.servedInCombatZonePost911;

  client.selectYesNo('root_servedInCombatZonePost911', served);
}

function completeMilitaryHistory(client, data) {
  // With prefill there is already an entry for military history so need to click Add Another first
  client.click('.va-growable-add-btn');
  const { servicePeriods } = data.serviceInformation;

  servicePeriods.forEach((period, i, list) => {
    const { serviceBranch, dateRange } = servicePeriods[i];

    // increment i by 1 because of prefill
    client
      .selectDropdown(
        `root_serviceInformation_servicePeriods_${i + 1}_serviceBranch`,
        serviceBranch,
      )
      .fillDate(
        `root_serviceInformation_servicePeriods_${i + 1}_dateRange_from`,
        dateRange.from,
      )
      .fillDate(
        `root_serviceInformation_servicePeriods_${i + 1}_dateRange_to`,
        dateRange.to,
      );

    if (i < list.length - 1) client.click('.va-growable-add-btn');
  });
}

function completeReservesNationalGuardInfo(client, data) {
  const {
    unitName,
    obligationTermOfServiceDateRange,
  } = data.serviceInformation.reservesNationalGuardService;

  client
    .fill(
      'input[name="root_serviceInformation_reservesNationalGuardService_unitName"]',
      unitName,
    )
    .fillDate(
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_from',
      obligationTermOfServiceDateRange.from,
    )
    .fillDate(
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_to',
      obligationTermOfServiceDateRange.to,
    );
}

function completeFederalOrders(client, data) {
  const reservesNationalGuardService =
    data.serviceInformation.reservesNationalGuardService;
  const activated = reservesNationalGuardService['view:isTitle10Activated'];

  client.selectYesNo(
    'root_serviceInformation_reservesNationalGuardService_view:isTitle10Activated',
    activated,
  );
  if (activated) {
    const {
      title10ActivationDate,
      anticipatedSeparationDate,
    } = reservesNationalGuardService.title10Activation;
    client
      .fillDate(
        'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
        title10ActivationDate,
      )
      .fillDate(
        'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
        anticipatedSeparationDate,
      );
  }
}

function selectDisabilities(client) {
  // Prefill data allows this to work
  client.fillCheckbox('input[name="root_ratedDisabilities_0"]', true);
}

function completeNewDisability(client, data) {
  const newDisabilities = data['view:newDisabilities'];

  client.selectYesNo('root_view:newDisabilities', newDisabilities);
}

function addNewDisability(client, data) {
  data.newDisabilities.forEach((disability, i, list) => {
    client.fill(
      `input[name="root_newDisabilities_${i}_condition"]`,
      disability.condition,
    );
    if (i < list.length - 1) client.click('.va-growable-add-btn');
  });
  client.click('body');
}

function completeUnemployabilityStatus(client, data) {
  const unemployabilityStatus = data['view:unemployabilityStatus'];

  client.selectYesNo('root_view:unemployabilityStatus', unemployabilityStatus);
}

function completePowStatus(client, data) {
  const powStatus = data['view:powStatus'];

  client.selectYesNo('root_view:powStatus', powStatus);
}

function completeEvidenceTypes(client, data) {
  const hasEvidence = data['view:hasEvidence'];
  const evidenceTypes =
    data['view:hasEvidenceFollowUp']['view:selectableEvidenceTypes'];

  client
    .selectYesNo('root_view:hasEvidence', hasEvidence)
    // .fillCheckbox(
    //   'input[name="root_view:hasEvidenceFollowUp_view:selectableEvidenceTypes_view:hasVAMedicalRecords"]',
    //   evidenceTypes['view:vaMedicalRecords'],
    // )
    .fillCheckbox(
      'input[name="root_view:hasEvidenceFollowUp_view:selectableEvidenceTypes_view:hasPrivateMedicalRecords"]',
      evidenceTypes['view:privateMedicalRecords'],
    );
  // .fillCheckbox(
  //   'input[name="root_view:hasEvidenceFollowUp_view:selectableEvidenceTypes_view:hasOtherEvidence"]',
  //   evidenceTypes['view:otherEvidence'],
  // );
}

function completePrivateMedicalRecordsChoice(client, data) {
  const pmrChoice =
    data['view:uploadPrivateRecordsQualifier'][
      'view:hasPrivateMedicalRecordsToUpload'
    ];

  client.selectYesNo(
    'root_view:uploadPrivateRecordsQualifier_view:hasPrivateRecordsToUpload',
    pmrChoice,
  );
}

function completeRecordReleaseInformation(client, data) {
  const providerFacilities = data.providerFacility;
  const limitedConsentChoice = data['view:limitedConsent'];
  const { limitedConsent } = data;

  providerFacilities.forEach((facility, i, list) => {
    client
      .waitForElementVisible(
        `input[name="root_providerFacility_${i}_providerFacilityName"]`,
        Timeouts.normal,
      )
      .fill(
        `input[name="root_providerFacility_${i}_providerFacilityName"]`,
        facility.providerFacilityName,
      )
      .fillDate(
        `root_providerFacility_${i}_treatmentDateRange_from`,
        facility.treatmentDateRange.from,
      )
      .fillDate(
        `root_providerFacility_${i}_treatmentDateRange_to`,
        facility.treatmentDateRange.to,
      )
      .selectDropdown(
        `root_providerFacility_${i}_providerFacilityAddress_country`,
        facility.providerFacilityAddress.country,
      )
      .fill(
        `input[name="root_providerFacility_${i}_providerFacilityAddress_street"]`,
        facility.providerFacilityAddress.street,
      )
      .fill(
        `input[name="root_providerFacility_${i}_providerFacilityAddress_city"]`,
        facility.providerFacilityAddress.city,
      )
      .selectDropdown(
        `root_providerFacility_${i}_providerFacilityAddress_state`,
        facility.providerFacilityAddress.state,
      )
      .fill(
        `input[name="root_providerFacility_${i}_providerFacilityAddress_postalCode"]`,
        facility.providerFacilityAddress.postalCode,
      );

    if (i < list.length - 1) client.click('.va-growable-add-btn');

    client
      .fillCheckbox(
        'input[name="root_view:limitedConsent"]',
        limitedConsentChoice,
      )
      .waitForElementVisible(
        'input[name="root_limitedConsent"]',
        Timeouts.normal,
      )
      .fill('input[name="root_limitedConsent"]', limitedConsent);
  });
}

function initInProgressMock(token) {
  mock(token, {
    path: '/v0/in_progress_forms/21-526EZ',
    verb: 'get',
    value: {
      formData: {
        veteran: {
          primaryPhone: '4445551212',
          emailAddress: 'test2@test1.net',
        },
        disabilities: [
          {
            name: 'Diabetes mellitus0',
            ratedDisabilityId: '0',
            ratingDecisionId: '63655',
            diagnosticCode: 5238,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 100,
          },
          {
            name: 'Diabetes mellitus1',
            ratedDisabilityId: '1',
            ratingDecisionId: '63655',
            diagnosticCode: 5238,
            decisionCode: 'SVCCONNCTED',
            decisionText: 'Service Connected',
            ratingPercentage: 100,
          },
        ],
        servicePeriods: [
          {
            serviceBranch: 'Air Force Reserve',
            dateRange: {
              from: '2001-03-21',
              to: '2014-07-21',
            },
          },
        ],
        reservesNationalGuardService: {
          obligationTermOfServiceDateRange: {
            from: '2007-05-22',
            to: '2008-06-05',
          },
        },
      },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/veteran-information',
      },
    },
  });
}

function initDocumentUploadMock() {
  mock(null, {
    path: '/v0/claim_attachments',
    verb: 'post',
    value: {
      data: {
        attributes: {
          guid: '123fake-submission-id-567',
        },
      },
    },
  });
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/21-526EZ',
    verb: 'post',
    value: {
      data: {
        attributes: {
          guid: '123fake-submission-id-567',
        },
      },
    },
  });
}

function initItfMock(token) {
  mock(token, {
    path: '/v0/intent_to_file',
    verb: 'get',
    value: {
      data: {
        id: '',
        type: 'evss_intent_to_file_intent_to_files_responses',
        attributes: {
          intentToFile: [
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.786+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'active',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.788+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'claim_recieved',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.789+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'claim_recieved',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.789+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'expired',
              type: 'compensation',
            },
            {
              id: '1',
              creationDate: '2014-07-28T19:53:45.810+00:00',
              expirationDate: '2015-08-28T19:47:52.790+00:00',
              participantId: 1,
              source: 'EBN',
              status: 'incomplete',
              type: 'compensation',
            },
          ],
        },
      },
    },
  });
}

function initPaymentInformationMock(token) {
  mock(token, {
    path: '/v0/ppiu/payment_information',
    verb: 'get',
    value: {
      data: {
        id: '',
        type: 'evss_ppiu_payment_information_responses',
        attributes: {
          responses: [
            {
              controlInformation: {
                canUpdateAddress: true,
                corpAvailIndicator: true,
                corpRecFoundIndicator: true,
                hasNoBdnPaymentsIndicator: true,
                identityIndicator: true,
                isCompetentIndicator: true,
                indexIndicator: true,
                noFiduciaryAssignedIndicator: true,
                notDeceasedIndicator: true,
              },
              paymentAccount: {
                accountType: 'Checking',
                financialInstitutionName: 'Comerica',
                accountNumber: '9876543211234',
                financialInstitutionRoutingNumber: '042102115',
              },
              paymentAddress: {
                type: null,
                addressEffectiveDate: null,
                addressOne: null,
                addressTwo: null,
                addressThree: null,
                city: null,
                stateCode: null,
                zipCode: null,
                zipSuffix: null,
                countryName: null,
                militaryPostOfficeTypeCode: null,
                militaryStateCode: null,
              },
              paymentType: 'CNP',
            },
          ],
        },
      },
    },
  });
}

// Possibly used outside of flow to, and including, 4142
// function completeApplicantInformation(client, data) {
//   client
//     .fillName('root_fullName', data.fullName)
//     .selectDropdown('root_gender', data.gender)
//     .fill('input[name="root_socialSecurityNumber"]', data.socialSecurityNumber)
//     .fillDate('root_dateOfBirth', data.dateOfBirth)
//     .selectDropdown('root_serviceBranch', data.serviceBranch);
// }

// function completeVeteranAddressInformation(client, data) {
//   const { addressLine1, city, state, zipCode } = data.veteran.mailingAddress;

//   client
//     .fill(
//       'input[name="root_veteran_mailingAddress_addressLine1"]',
//       addressLine1,
//     )
//     .fill('input[name="root_veteran_mailingAddress_city"]', city)
//     .selectDropdown('root_veteran_mailingAddress_state', state)
//     .fill('input[name="root_veteran_mailingAddress_zipCode"]', zipCode);
// }

// function completeHomelessness(client, data) {
//   client.selectYesNo(
//     'root_veteran_homelessness_isHomeless',
//     data.veteran.homelessness.isHomeless,
//   );
// }

// function completeVAFacilitiesInformation(client, data) {
//   data.treatments.forEach((treatment, i, list) => {
//     client
//       .waitForElementVisible(
//         `input[name="root_treatments_${i}_treatment_treatmentCenterName"]`,
//         Timeouts.normal,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_startTreatmentMonth`,
//         data.treatments[0].startTreatmentMonth,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_startTreatmentDay`,
//         data.treatments[0].startTreatmentDay,
//       )
//       .fill(
//         `input[name="root_treatments_${i}_treatment_startTreatmentYear"]`,
//         data.treatments[0].startTreatmentYear,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_endTreatmentMonth`,
//         data.treatments[0].endTreatmentMonth,
//       )
//       .selectDropdown(
//         `root_treatments_${i}_treatment_endTreatmentDay`,
//         data.treatments[0].endTreatmentDay,
//       )
//       .fill(
//         `input[name="root_treatments_${i}_treatment_endTreatmentYear"]`,
//         data.treatments[0].endTreatmentYear,
//       )
//       .fill(
//         `input[name="root_treatments_${i}_treatment_treatmentCenterName"]`,
//         data.treatments[0].treatmentCenterName,
//       );
//     if (i < list.length - 1) client.click('.va-growable-add-btn');
//   });
// }

module.exports = {
  initInProgressMock,
  initDocumentUploadMock,
  initApplicationSubmitMock,
  initItfMock,
  initPaymentInformationMock,
  completeAlternateName,
  completeMilitaryRetiredPay,
  completeCombatZonePost911,
  completeMilitaryHistory,
  completeReservesNationalGuardInfo,
  completeFederalOrders,
  selectDisabilities,
  completeNewDisability,
  addNewDisability,
  completeUnemployabilityStatus,
  completePowStatus,
  completeEvidenceTypes,
  completePrivateMedicalRecordsChoice,
  completeRecordReleaseInformation,
};
