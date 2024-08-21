/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { adjustYearString, concatStreets } from '../../shared/utilities';

function getPrimaryContact(data) {
  // For callback API we need to know what data in the form should be
  // treated as the primary contact.
  return {
    name: data?.certifierName ?? data?.applicantName ?? false,
    email: false, // We don't collect email
    phone: data?.certifierPhone ?? data?.applicantPhone ?? false,
  };
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  let copyOfData = JSON.parse(JSON.stringify(transformedData));

  // Set this for the callback API so it knows who to contact if there's
  // a status event notification
  copyOfData.primaryContactInfo = getPrimaryContact(copyOfData);

  // ---
  // Add type/category info to file uploads:
  const medicalUpload = copyOfData?.medicalUpload?.map(el => {
    return { ...el, documentType: 'itemized billing statement' };
  });
  copyOfData.medicalUpload = medicalUpload;

  const primaryEob = copyOfData?.primaryEob?.map(el => {
    return { ...el, documentType: 'Eob' };
  });
  copyOfData.primaryEob = primaryEob;

  const secondaryEob = copyOfData?.secondaryEob?.map(el => {
    return { ...el, documentType: 'Eob' };
  });
  copyOfData.secondaryEob = secondaryEob;
  // ---

  // Combine all three street strings into one
  copyOfData.applicantAddress.streetCombined = concatStreets(
    copyOfData.applicantAddress,
  );

  if (copyOfData.certifierAddress) {
    // Combine streets for 3rd party certifier
    copyOfData.certifierAddress.streetCombined = concatStreets(
      copyOfData.certifierAddress,
    );
  }

  // Date of signature
  copyOfData.certificationDate = new Date().toISOString().replace(/T.*/, '');

  // Compile files
  copyOfData.supportingDocs = [
    copyOfData.medicalUpload,
    copyOfData.primaryEob,
    copyOfData.secondaryEob,
    copyOfData.pharmacyUpload,
  ]
    .flat(Infinity) // Flatten nested lists of files
    .filter(el => el); // drop any nulls

  copyOfData.fileNumber = copyOfData.applicantMemberNumber;

  copyOfData = adjustYearString(copyOfData);

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
