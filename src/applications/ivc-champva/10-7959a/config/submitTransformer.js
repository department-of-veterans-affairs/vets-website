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
      claimIsAutoRelatedd: copyOfData.claimIsAutoRelated,
      claimIsWorkRelated: copyOfData.claimIsWorkRelated,
      claimType: copyOfData.claimType,
      claimId: 0, // Always zero - we only support one claim currently
    },
  ];

  copyOfData.fileNumber = copyOfData.applicantMemberNumber;

  copyOfData = adjustYearString(copyOfData);

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
