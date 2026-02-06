/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';
import { adjustYearString, concatStreets } from '../../shared/utilities';
import { ID_NUMBER_OPTIONS } from '../chapters/resubmission';

function getPrimaryContact(data) {
  // For callback API we need to know what data in the form should be
  // treated as the primary contact.
  return {
    name: data?.certifierName ?? data?.applicantName ?? false,
    email: data?.certifierEmail ?? data?.applicantEmail ?? false,
    phone: data?.certifierPhone ?? data?.applicantPhone ?? false,
  };
}

/**
 * Build supportingDocs without mutating `data`
 * @param {Object} data
 * @param {[string, string][]} mapping - e.g. [['pharmacyUpload','MEDDOCS'], ['primaryEob','EOB']]
 * @returns {Array} supportingDocs
 */
const applyAttachments = (formData, mapping) => {
  const withAttachments = (arr, attachmentId) =>
    (Array.isArray(arr) ? arr : [])
      .filter(Boolean)
      .map(item => ({ ...item, attachmentId }));
  return mapping
    .flatMap(([key, id]) => withAttachments(formData[key], id))
    .filter(Boolean);
};

export default function transformForSubmit(
  formConfig,
  form,
  disableAnalytics = false,
) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  let copyOfData = JSON.parse(JSON.stringify(transformedData));

  // If user is the sponsor, copy sponsor details into the certifier section:
  if (copyOfData.certifierRole === 'sponsor') {
    copyOfData.certifierName = copyOfData.sponsorName;
    copyOfData.certifierAddress = copyOfData.sponsorAddress;
    copyOfData.certifierPhone = copyOfData.sponsorPhone;
    copyOfData.certifierEmail = copyOfData.sponsorEmail;
  }

  // Set this for the callback API so it knows who to contact if there's
  // a status event notification
  copyOfData.primaryContactInfo = getPrimaryContact(copyOfData);

  // Add type/category info to file uploads for Pega/DOCMP ingestion:
  copyOfData.supportingDocs = applyAttachments(copyOfData, [
    ['pharmacyUpload', 'MEDDOCS'],
    ['medicalUpload', 'MEDDOCS'],
    ['primaryEob', 'EOB'],
    ['secondaryEob', 'EOB'],
    ['resubmissionLetterUpload', 'EOB'],
    ['resubmissionDocsUpload', 'MEDDOCS'],
  ]);

  // Combine all three street strings into one
  copyOfData.applicantAddress = concatStreets(copyOfData.applicantAddress);

  if (copyOfData.certifierAddress) {
    // Combine streets for 3rd party certifier
    copyOfData.certifierAddress = concatStreets(copyOfData.certifierAddress);
  }

  // Date of signature
  copyOfData.certificationDate = new Date().toISOString().replace(/T.*/, '');

  /*
  In order to enable multi-claim backend (see https://github.com/department-of-veterans-affairs/vets-api/pull/18173)
  create a `claims` array with one entry. When we move to the list-loop
  claims collection, this will be produced by the "claims" array builder.
  For now, this is here so that the backend changes may be merged in without 
  breaking the existing single-claim flow.

  TODO: Remove this claims array when we switch to list loop for claims on frontend
  */
  copyOfData.claims = [
    {
      claimIsAutoRelated: copyOfData.claimIsAutoRelated,
      claimIsWorkRelated: copyOfData.claimIsWorkRelated,
      claimType: copyOfData.claimType,
      claimId: 0, // Always zero - we only support one claim currently
    },
  ];

  copyOfData.fileNumber = copyOfData.applicantMemberNumber;

  copyOfData = adjustYearString(copyOfData);

  if (!disableAnalytics) {
    const getEventName = () => {
      if (copyOfData.claimStatus === 'new') return '10-7959a_new_claim';
      if (copyOfData.pdiOrClaimNumber === ID_NUMBER_OPTIONS[1]) {
        return '10-7959a_reopen_claim_control_number';
      }
      return '10-7959a_resubmission_pdi_number';
    };

    recordEvent({ event: getEventName() });
  }

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
