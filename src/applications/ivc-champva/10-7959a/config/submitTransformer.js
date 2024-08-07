/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

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

  const copyOfData = JSON.parse(JSON.stringify(transformedData));

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

  // Date of signature
  copyOfData.certificationDate = new Date().toISOString().replace(/T.*/, '');

  // Compile files
  copyOfData.supportingDocs = [
    copyOfData.medicalUpload,
    copyOfData.primaryEob,
    copyOfData.secondaryEob,
  ]
    .flat(Infinity) // Flatten nested lists of files
    .filter(el => el); // drop any nulls

  copyOfData.fileNumber = copyOfData.applicantMemberNumber;

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
