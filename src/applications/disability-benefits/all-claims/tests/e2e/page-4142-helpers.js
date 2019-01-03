import { clickAddAnother } from './disability-benefits-helpers';

const Timeouts = require('../../../../../platform/testing/e2e/timeouts.js');

export const completeEvidenceTypes = (client, data) => {
  const hasEvidence = data['view:hasEvidence'];
  const evidenceTypes =
    data['view:hasEvidenceFollowUp']['view:selectableEvidenceTypes'];

  client.selectYesNo('root_view:hasEvidence', hasEvidence);

  if (hasEvidence) {
    client
      .fillCheckbox(
        'input[name="root_view:hasEvidenceFollowUp_view:selectableEvidenceTypes_view:hasVAMedicalRecords"]',
        evidenceTypes['view:vaMedicalRecords'],
      )
      .fillCheckbox(
        'input[name="root_view:hasEvidenceFollowUp_view:selectableEvidenceTypes_view:hasPrivateMedicalRecords"]',
        evidenceTypes['view:privateMedicalRecords'],
      )
      .fillCheckbox(
        'input[name="root_view:hasEvidenceFollowUp_view:selectableEvidenceTypes_view:hasOtherEvidence"]',
        evidenceTypes['view:otherEvidence'],
      );
  }
};

export const completeVaMedicalRecords = (client, data) => {
  data.vaTreatmentFacilities.forEach((facility, i, list) => {
    client.fill(
      `input[name="root_vaTreatmentFacilities_${i}_treatmentCenterName"]`,
      facility.treatmentCenterName,
    );

    Object.keys(facility.treatedDisabilityNames).forEach(disability => {
      client.fillCheckbox(
        `input[name="root_vaTreatmentFacilities_${i}_treatedDisabilityNames_${disability}"]`,
        facility.treatedDisabilityNames[disability],
      );
    });

    const treatmentDateRange = facility.treatmentDateRange;
    if (treatmentDateRange) {
      client
        .fillDate(
          `root_vaTreatmentFacilities_${i}_treatmentDateRange_from`,
          treatmentDateRange.from,
        )
        .fillDate(
          `root_vaTreatmentFacilities_${i}_treatmentDateRange_to`,
          treatmentDateRange.to,
        );
    }

    if (facility.treatmentCenterAddress) {
      client.fillAddress(
        `root_vaTreatmentFacilities_${0}_treatmentCenterAddress_country`,
        facility.treatmentCenterAddress,
      );
    }

    clickAddAnother(client, i, list);
  });
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

  if (!pmrChoice) {
    const acknowledgement =
      data['view:patientAcknowledgement']['view:acknowledgement'];
    client.fillCheckbox(
      'root_view:patientAcknowledgement_view:acknowledgement',
      acknowledgement,
    );
  }
};

export const completeRecordReleaseInformation = (client, data) => {
  data.providerFacility.forEach((facility, i, list) => {
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
  });

  const limitedConsentChoice = data['view:limitedConsent'];
  const { limitedConsent } = data;

  client
    .fillCheckbox(
      'input[name="root_view:limitedConsent"]',
      limitedConsentChoice,
    )
    .waitForElementVisible('input[name="root_limitedConsent"]', Timeouts.normal)
    .fill('input[name="root_limitedConsent"]', limitedConsent);
};

export const completeAdditionalEvidence = (client, data) => {
  data.additionalDocuments.forEach((document, i, list) => {
    client
      .fillUpload(__dirname, document.name)
      .selectDropdown(
        `root_additionalDocuments_${i}_atachmentId`,
        document.attachmentId,
      );

    clickAddAnother(client, i, list);
  });
};
