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
      vet_relationship: transformRelationship(
        app.applicantRelationshipToSponsor?.relationshipToVeteran || 'NA',
      ),
      applicant_supporting_documents: [
        app?.applicantMedicareCardFront,
        app?.applicantMedicareCardBack,
        app?.applicantOHICardFront,
        app?.applicantOHICardBack,
        app?.applicantBirthCertOrSocialSecCard,
        app?.applicantMedicarePartAPartBCard,
        app?.applicantMedicarePartDCard,
        app?.applicantOhiCard,
        app?.applicant107959c,
        app?.applicantSchoolCert,
        app?.applicantAdoptionPapers,
        app?.applicantStepMarriageCert,
        app?.applicantMarriageCert,
      ],
      address: app.applicantAddress ?? '',
      gender: app.applicantGender ?? '',
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
    supporting_docs: [
      transformedData?.sponsorCasualtyReport,
      transformedData?.sponsorDisabilityRating,
      transformedData?.sponsorDischargePapers,
    ],
  };

  // Flatten supporting docs for all applicants to a single array
  const supDocs = [];
  dataPostTransform.applicants.forEach(app => {
    if (app.applicant_supporting_documents.length > 0) {
      app.applicant_supporting_documents.forEach(doc => {
        if (doc !== undefined) {
          supDocs.push(...doc);
        }
      });
    }
  });

  dataPostTransform.supporting_docs = dataPostTransform.supporting_docs
    .concat(supDocs)
    .filter(el => el); // remove undefineds

  // eslint-disable-next-line dot-notation
  dataPostTransform.veteran.address['postal_code'] =
    dataPostTransform.veteran.address.postalCode || '';
  delete dataPostTransform.veteran.address.postalCode;

  return JSON.stringify({
    ...dataPostTransform,
    formNumber: formConfig.formId,
  });
}
