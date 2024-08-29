/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { getObjectsWithAttachmentId } from '../helpers/utilities';
import { concatStreets } from '../../shared/utilities';

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

  // Combine all street strings for main address into one
  if (copyOfData.applicantAddress)
    copyOfData.applicantAddress.streetCombined = concatStreets(
      copyOfData.applicantAddress,
    );

  // Get today's date as YYYY-MM-DD
  copyOfData.certificationDate = new Date().toISOString().replace(/T.*/, '');

  // Make sure all dates are in MM-DD-YYYY format
  Object.keys(copyOfData).forEach(key => {
    if (key.toLowerCase().includes('date')) {
      const date = copyOfData[key];
      copyOfData[key] = `${date.slice(5)}-${date.slice(0, 4)}`;
    }
  });

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
