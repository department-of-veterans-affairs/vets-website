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
  return ret || '';
}

function transformApplicants(applicants) {
  const applicantsPostTransform = [];

  applicants.forEach(app => {
    // Snake_case names are present because the existing backend controller
    // for this form uses them. May adjust with future refactor.
    const transformedApp = {
      full_name: app.applicantName ?? '',
      ssh_or_tin: app.applicantSSN ?? '',
      date_of_birth: app.applicantDOB ?? '',
      phone_number: app.applicantPhone ?? '',
      email: app.applicantEmailAddress ?? '',
      vet_relationship: transformRelationship(
        app.applicantRelationshipToSponsor?.relationshipToVeteran || 'NA',
      ),
      sponsor_marriage_details:
        app?.applicantSponsorMarriageDetails?.relationshipToVeteran || 'NA',
      applicant_supporting_documents: [
        app?.applicantMedicareCardFront,
        app?.applicantMedicareCardBack,
        app?.applicantOHICardFront,
        app?.applicantOHICardBack,
        app?.applicantBirthCertOrSocialSecCard,
        app?.applicantSchoolCert,
        app?.applicantAdoptionPapers,
        app?.applicantStepMarriageCert,
        app?.applicantMarriageCert,
        app?.applicantSecondMarriageCert,
        app?.applicantSecondMarriageDivorceCert,
        app?.applicantMedicarePartAPartBCard,
        app?.applicantMedicarePartDCard,
        app?.applicantMedicareIneligibleProof,
        app?.applicantOhiCard,
        app?.applicantOtherInsuranceCertification,
        app?.applicantHelplessCert,
      ],
      address: app.applicantAddress ?? {},
      gender: app.applicantGender?.gender ?? '',
    };

    // eslint-disable-next-line dot-notation
    transformedApp.address['postal_code'] = transformedApp.address.postalCode;
    delete transformedApp.address.postalCode;

    applicantsPostTransform.push(transformedApp);
  });

  return applicantsPostTransform;
}

function parseCertifier(transformedData) {
  return {
    date: new Date().toJSON().slice(0, 10),
    firstName: transformedData.veteransFullName.first || '',
    lastName: transformedData.veteransFullName.last || '',
    middleInitial: transformedData?.veteransFullName?.middle || '',
    phone_number: transformedData?.sponsorPhone || '',
    relationship: '',
    streetAddress: transformedData?.sponsorAddress?.street || '',
    city: transformedData?.sponsorAddress?.city || '',
    state: transformedData?.sponsorAddress?.state || '',
    postal_code: transformedData?.sponsorAddress?.postal_code || '',
  };
}

function getPrimaryContact(data) {
  // If a certification name is present, we know the form was filled by
  // a third party or the sponsor, and that they should be primary contact.
  const useCert =
    data?.certification?.firstName && data?.certification?.firstName !== '';

  // Depending on the result of useCert, grab the first and last name, phone,
  // and email from either the `certification` object or the first applicant,
  // then return so we can set up the `primaryContactInfo` for the backend
  // notification API service.
  return {
    name: {
      first:
        (useCert
          ? data?.certification?.firstName
          : data?.applicants?.[0]?.full_name?.first) ?? false,
      last:
        (useCert
          ? data?.certification?.lastName
          : data?.applicants?.[0]?.full_name?.last) ?? false,
    },
    email:
      (useCert ? data?.certification?.email : data?.applicants?.[0]?.email) ??
      false,
    phone:
      (useCert
        ? data?.certification?.phone_number
        : data?.applicants?.[0]?.phone_number) ?? false,
  };
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  const dataPostTransform = {
    veteran: {
      full_name: transformedData?.veteransFullName || {},
      ssn_or_tin: transformedData?.ssn?.ssn || '',
      va_claim_number: transformedData?.vaFileNumber || '',
      date_of_birth: transformedData?.sponsorDOB || '',
      phone_number: transformedData?.sponsorPhone || '',
      address: transformedData?.sponsorAddress || {
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
        country: 'NA',
      },
      date_of_death: transformedData?.sponsorDOD || '',
      date_of_marriage: transformedData?.sponsorDOM || '',
      is_active_service_death: transformedData?.sponsorDeathConditions || '',
    },
    applicants: transformApplicants(transformedData.applicants ?? []),
    certification: {
      date: transformedData?.dateOfCertification || '',
      lastName: transformedData?.certifierName?.last || '',
      middleInitial: transformedData?.certifierName?.middle || '',
      firstName: transformedData?.certifierName?.first || '',
      phone_number: transformedData?.certifierPhone || '',
      relationship: transformRelationship(
        transformedData?.certifierRelationship,
      ),
      streetAddress: transformedData?.certifierAddress?.street || '',
      city: transformedData?.certifierAddress?.city || '',
      state: transformedData?.certifierAddress?.state || '',
      postal_code: transformedData?.certifierAddress?.postalCode || '',
    },
    supporting_docs: [],
    // Include everything we originally received
    raw_data: transformedData,
  };

  // Fill in certification data with sponsor info as needed
  if (form.data.certifierRole === 'sponsor')
    dataPostTransform.certification = { ...parseCertifier(transformedData) };

  // Flatten supporting docs for all applicants to a single array
  const supDocs = [];
  dataPostTransform.applicants.forEach(app => {
    if (app.applicant_supporting_documents.length > 0) {
      app.applicant_supporting_documents.forEach(doc => {
        if (doc !== undefined && doc !== null) {
          // doc is an array of files for a given input (e.g., insurance cards).

          // For clarity's sake, add applicant's name onto each file object:
          const files = doc.map(file => ({
            ...file,
            applicantName: app.full_name,
          }));

          supDocs.push(...files);
        }
      });
    }
  });

  dataPostTransform.supporting_docs = dataPostTransform.supporting_docs
    .flat()
    .concat(supDocs)
    .filter(el => el); // remove undefineds

  // eslint-disable-next-line dot-notation
  dataPostTransform.veteran.address['postal_code'] =
    dataPostTransform.veteran.address.postalCode || '';
  delete dataPostTransform.veteran.address.postalCode;

  // For our backend callback API, we need to designate which contact info
  // should be used if there is a notification event pertaining to this specific
  // form submission. We do this by adding the `primaryContactInfo` key:
  dataPostTransform.primaryContactInfo = getPrimaryContact(dataPostTransform);

  return JSON.stringify({
    ...dataPostTransform,
    formNumber: formConfig.formId,
  });
}
