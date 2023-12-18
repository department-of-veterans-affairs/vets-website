/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

// Simplify relationship to a single key/value.
function transformRelationship(relationship) {
  let ret;
  if (typeof relationship === 'string') {
    ret = relationship; // Nothing to do here
  } else if (relationship?.relationshipToVeteran) {
    // If they chose "other" and typed a freeform answer, grab the text
    ret = relationship.otherRelationshipToVeteran
      ? relationship.otherRelationshipToVeteran
      : relationship.relationshipToVeteran;
  }
  return ret || ''; // '' if we got an undef val
}

function transformApplicants(applicants) {
  const applicantsPostTransform = [];

  applicants.forEach(app => {
    const transformedApp = {
      full_name: app.applicantName,
      ssh_or_tin: app.applicantSSN.ssn,
      date_of_birth: app.applicantDOB,
      phone_number: app.applicantPhone,
      vet_relationship: transformRelationship(
        app.applicantRelationshipToSponsor.relationshipToVeteran,
      ),
      address: app.applicantAddress,
      gender: app.applicantGender,
    };

    // eslint-disable-next-line dot-notation
    transformedApp.address['postal_code'] = transformedApp.address.postalCode;
    delete transformedApp.address.postalCode;

    applicantsPostTransform.push(transformedApp);
  });

  return applicantsPostTransform;
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  // eslint-disable-next-line no-console
  // console.log(
  //   'Custom transformer called with data: ',
  //   JSON.stringify(transformedData),
  //   transformedData,
  // );

  // Make changes to transformedData here...
  const dataPostTransform = {
    veteran: {
      full_name: transformedData.veteransFullName || {},
      ssn_or_tin: transformedData.ssn.ssn || '',
      va_claim_number: transformedData.vaFileNumber || '',
      date_of_birth: transformedData.sponsorDOB || '',
      phone_number: transformedData?.sponsorPhone || '',
      address: transformedData.sponsorAddress || {
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
        country: 'NA',
      },
      date_of_death: transformedData.sponsorDOD || '',
      date_of_marriage: transformedData.sponsorDOM || '',
    },
    applicants: transformApplicants(transformedData.applicants),
    certification: {
      date: transformedData?.dateOfCertification || '', // TODO: add field
      lastName: transformedData.certifierName.last || '',
      middleInitial: transformedData.certifierName?.middle || '',
      firstName: transformedData.certifierName.first || '',
      phone_number: transformedData?.certifierPhone || '',
      relationship: transformRelationship(
        transformedData?.certifierRelationship,
      ),
      streetAddress: transformedData?.certifierAddress.street || '',
      city: transformedData?.certifierAddress.city || '',
      state: transformedData?.certifierAddress.state || '',
      postal_code: transformedData?.certifierAddress.postalCode || '',
    },
  };

  // eslint-disable-next-line dot-notation
  dataPostTransform.veteran.address['postal_code'] =
    dataPostTransform.veteran.address.postalCode || '';
  delete dataPostTransform.veteran.address.postalCode;

  // eslint-disable-next-line no-console
  // console.log('Transformed to: ', dataPostTransform);

  return JSON.stringify({
    ...dataPostTransform,
    formNumber: formConfig.formId,
  });
}
