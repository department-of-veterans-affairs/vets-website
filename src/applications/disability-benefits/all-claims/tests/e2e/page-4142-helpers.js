import { clickAddAnother } from './disability-benefits-helpers';

const Timeouts = require('../../../../../platform/testing/e2e/timeouts.js');

export const completeEvidenceTypes = (client, data) => {
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
};

export const completePrivateMedicalRecordsChoice = (client, data) => {
  const pmrChoice =
    data['view:uploadPrivateRecordsQualifier'][
      'view:hasPrivateMedicalRecordsToUpload'
    ];

  client.selectYesNo(
    'root_view:uploadPrivateRecordsQualifier_view:hasPrivateRecordsToUpload',
    pmrChoice,
  );
};

export const completeRecordReleaseInformation = (client, data) => {
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

    clickAddAnother(client, i, list);

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
};
