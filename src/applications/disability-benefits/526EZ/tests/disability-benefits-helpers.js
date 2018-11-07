const mock = require('../../../../platform/testing/e2e/mock-helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

// Unused?
function completeApplicantInformation(client, data) {
  client
    .fillName('root_fullName', data.fullName)
    .selectDropdown('root_gender', data.gender)
    .fill('input[name="root_socialSecurityNumber"]', data.socialSecurityNumber)
    .fillDate('root_dateOfBirth', data.dateOfBirth)
    .selectDropdown('root_serviceBranch', data.serviceBranch);
}

function completeMilitaryHistory(client, data) {
  data.servicePeriods.forEach((period, i, list) => {
    const { serviceBranch, dateRange } = data.servicePeriods[i];

    client
      .selectDropdown(`root_servicePeriods_${i}_serviceBranch`, serviceBranch)
      .fillDate(`root_servicePeriods_${i}_dateRange_from`, dateRange.from)
      .fillDate(`root_servicePeriods_${i}_dateRange_to`, dateRange.to);

    if (i < list.length - 1) client.click('.va-growable-add-btn');
  });
}

// Used.
function completeVeteranAddressInformation(client, data) {
  const { addressLine1, city, state, zipCode } = data.veteran.mailingAddress;

  client
    .fill(
      'input[name="root_veteran_mailingAddress_addressLine1"]',
      addressLine1,
    )
    .fill('input[name="root_veteran_mailingAddress_city"]', city)
    .selectDropdown('root_veteran_mailingAddress_state', state)
    .fill('input[name="root_veteran_mailingAddress_zipCode"]', zipCode);
}

function completeReservesNationalGuardInfo(client, data) {
  const { unitName, servicePeriods } = data;

  const activePeriod = servicePeriods.find(
    period => period.serviceBranch === 'Army Reserve',
  );

  client
    .fill('input[name="root_unitName"]', unitName)
    .fillDate(
      'root_obligationTermOfServiceDateRange_from',
      activePeriod.dateRange.from,
    )
    .fillDate(
      'root_obligationTermOfServiceDateRange_to',
      activePeriod.dateRange.to,
    )
    .selectYesNo('root_waiveVABenefitsToRetainTrainingPay', false);
}

function completeHomelessness(client, data) {
  client.selectYesNo(
    'root_veteran_homelessness_isHomeless',
    data.veteran.homelessness.isHomeless,
  );
}

function selectDisabilities(client) {
  client.fillCheckbox('input[name="root_disabilities_0"]', true);
}

function completeEvidenceTypeInformation(client, data) {
  const evidenceTypes = data.disabilities[0]['view:selectableEvidenceTypes'];

  client
    // .fillCheckbox(
    //   'input[name="root_view:selectableEvidenceTypes_view:vaMedicalRecords"]',
    //   evidenceTypes['view:vaMedicalRecords'],
    // )
    .fillCheckbox(
      'input[name="root_view:selectableEvidenceTypes_view:privateMedicalRecords"]',
      evidenceTypes['view:privateMedicalRecords'],
    );
  // .fillCheckbox(
  //   'input[name="root_view:selectableEvidenceTypes_view:otherEvidence"]',
  //   evidenceTypes['view:otherEvidence'],
  // );
}

function completePrivateMedicalRecordsChoice(client, data) {
  const pmrChoice = data.disabilities[0]['view:uploadPrivateRecords'];
  const acknowledgementChoice =
    data.disabilities[0]['view:patientAcknowledgement'];

  client
    .selectRadio('root_view:uploadPrivateRecords', pmrChoice)
    .fillCheckbox(
      'input[name="root_view:patientAcknowledgement_view:acknowledgement"]',
      acknowledgementChoice['view:acknowledgement'],
    )
    .fillCheckbox(
      'input[name="root_view:patientAcknowledgement_view:acknowledgement"]',
      acknowledgementChoice['view:acknowledgement'],
    );
}

function completeRecordReleaseInformation(client, data) {
  const providerFacilities = data.disabilities[0].providerFacility;
  const limitedConsentChoice = data.disabilities[0]['view:limitedConsent'];
  const limitedConsent = data.disabilities[0].limitedConsent;

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

function completeVAFacilitiesInformation(client, data) {
  data.treatments.forEach((treatment, i, list) => {
    client
      .waitForElementVisible(
        `input[name="root_treatments_${i}_treatment_treatmentCenterName"]`,
        Timeouts.normal,
      )
      .selectDropdown(
        `root_treatments_${i}_treatment_startTreatmentMonth`,
        data.treatments[0].startTreatmentMonth,
      )
      .selectDropdown(
        `root_treatments_${i}_treatment_startTreatmentDay`,
        data.treatments[0].startTreatmentDay,
      )
      .fill(
        `input[name="root_treatments_${i}_treatment_startTreatmentYear"]`,
        data.treatments[0].startTreatmentYear,
      )
      .selectDropdown(
        `root_treatments_${i}_treatment_endTreatmentMonth`,
        data.treatments[0].endTreatmentMonth,
      )
      .selectDropdown(
        `root_treatments_${i}_treatment_endTreatmentDay`,
        data.treatments[0].endTreatmentDay,
      )
      .fill(
        `input[name="root_treatments_${i}_treatment_endTreatmentYear"]`,
        data.treatments[0].endTreatmentYear,
      )
      .fill(
        `input[name="root_treatments_${i}_treatment_treatmentCenterName"]`,
        data.treatments[0].treatmentCenterName,
      );
    if (i < list.length - 1) client.click('.va-growable-add-btn');
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

module.exports = {
  initInProgressMock,
  initApplicationSubmitMock,
  initDocumentUploadMock,
  initItfMock,
  initPaymentInformationMock,
  completeApplicantInformation,
  completeVeteranAddressInformation,
  completeMilitaryHistory,
  completeReservesNationalGuardInfo,
  completeHomelessness,
  selectDisabilities,
  completeEvidenceTypeInformation,
  completeVAFacilitiesInformation,
  completeRecordReleaseInformation,
  completePrivateMedicalRecordsChoice,
};
