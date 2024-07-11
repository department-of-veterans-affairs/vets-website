/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { getObjectsWithAttachmentId } from '../helpers/utilities';

function getPrimaryContact(data) {
  // For callback API we need to know what data in the form should be
  // treated as the primary contact.
  return {
    name: data?.applicantName ?? false,
    email: false, // We don't collect email
    phone: data?.applicantPhone ?? false,
  };
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  const copyOfData = JSON.parse(JSON.stringify(transformedData));

  copyOfData.applicantMedicareAdvantage =
    copyOfData.applicantMedicareClass === 'advantage';

  copyOfData.hasOtherHealthInsurance =
    copyOfData.applicantHasPrimary || copyOfData.applicantHasSecondary;

  if (copyOfData.applicantName?.middle) {
    copyOfData.applicantName.middle =
      copyOfData.applicantName?.middle?.charAt(0) ?? '';
  }

  // Make sure all dates are in MM-DD-YYYY format
  Object.keys(copyOfData).forEach(key => {
    if (key.toLowerCase().includes('date')) {
      copyOfData[key] = new Date(copyOfData[key])
        // MM-DD-YYYY date w/ hyphens instead of slashes
        .toLocaleDateString('es-pa')
        .replace(/\//g, '-');
    }
  });

  copyOfData.certificationDate = new Date()
    .toLocaleDateString('es-pa')
    .replace(/\//g, '-');

  copyOfData.supportingDocs = getObjectsWithAttachmentId(copyOfData);

  // Set this for the callback API so it knows who to contact if there's
  // a status event notification
  copyOfData.primaryContactInfo = getPrimaryContact(copyOfData);

  copyOfData.statementOfTruthSignature = copyOfData.signature;

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
