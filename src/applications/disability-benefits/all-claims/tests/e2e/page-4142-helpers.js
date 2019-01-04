import { clickAddAnother } from './disability-benefits-helpers';

export const completePrivateMedicalRecordsChoice = (client, data) => {
  const pmrChoice =
    data['view:uploadPrivateRecordsQualifier'][
      'view:hasPrivateRecordsToUpload'
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
  } else {
    client.verify.fail('Upload required');
  }
};

export const completeRecordReleaseInformation = (client, data) => {
  data.providerFacility.forEach((facility, i, list) => {
    client
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
      .fillAddress(
        `root_providerFacility_${i}_providerFacilityAddress`,
        facility.providerFacilityAddress,
      );

    clickAddAnother(client, i, list);
  });

  const limitedConsentChoice = data['view:limitedConsent'];

  client.fillCheckbox(
    'input[name="root_view:limitedConsent"]',
    limitedConsentChoice,
  );
  if (limitedConsentChoice) {
    client.fill('input[name="root_limitedConsent"]', data.limitedConsent);
  }
};

export const completeAdditionalEvidence = (client, data) => {
  data.additionalDocuments.forEach((document, i, list) => {
    client
      .fillUpload('root_additionalDocuments', __dirname, document.name)
      .selectDropdown(
        `root_additionalDocuments_${i}_atachmentId`,
        document.attachmentId,
      );

    clickAddAnother(client, i, list);
  });
};
