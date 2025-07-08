/* eslint-disable no-param-reassign */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  adjustYearString,
  concatStreets,
  getAgeInYears,
  getObjectsWithAttachmentId,
  toHash,
} from '../../shared/utilities';

/**
 * Formats a date string from YYYY-MM-DD to MM-DD-YYYY
 * @param {string} date - Date string in format YYYY-MM-DD
 * @returns {string} Date in format MM-DD-YYYY or original input if invalid
 */
function formatDate(date) {
  return date?.length === 10 ? `${date.slice(5)}-${date.slice(0, 4)}` : date;
}

/**
 * Returns array of keys from an object where the value is true
 * @param {Object} obj - Object to filter
 * @returns {Array} Array of keys with truthy values
 */
function getTrueKeys(obj = {}) {
  return Object.keys(obj).filter(key => obj[key] === true);
}

/**
 * Extracts a relationship string from potentially complex relationship object
 * @param {Object|string} relationshipData - Relationship information
 * @returns {string} Simple relationship string
 */
function extractRelationship(relationshipData) {
  if (typeof relationshipData === 'string') {
    return relationshipData;
  }

  // Handle case where relationshipToVeteran is an object with boolean flags
  if (typeof relationshipData?.relationshipToVeteran === 'object') {
    const trueRelationship = Object.keys(
      relationshipData.relationshipToVeteran,
    ).find(key => relationshipData.relationshipToVeteran[key] === true);

    if (trueRelationship) {
      return trueRelationship;
    }
  }

  // Check for other relationship fields
  if (relationshipData?.otherRelationshipToVeteran) {
    return relationshipData.otherRelationshipToVeteran;
  }

  return relationshipData?.relationshipToVeteran || '';
}

/**
 * Transforms applicant data into required format
 * @param {Array} applicants - Array of applicant objects
 * @returns {Array} Transformed applicants array
 */
function transformApplicants(applicants = []) {
  return applicants.map(applicant => {
    const transformedApplicant = {
      ...applicant,
      ssnOrTin: applicant.applicantSSN ?? '',
      vetRelationship: extractRelationship(
        applicant.applicantRelationshipToSponsor || 'NA',
      ),
      // Get supporting documents for this applicant
      applicantSupportingDocuments: getObjectsWithAttachmentId(
        applicant,
        'confirmationCode',
      ),
    };

    // Apply year string adjustments and concatenate street addresses
    const withAdjustedYear = adjustYearString(transformedApplicant);
    return {
      ...withAdjustedYear,
      applicantAddress: concatStreets(withAdjustedYear.applicantAddress),
    };
  });
}

/**
 * Maps health insurance and Medicare policies to applicants
 * @param {Object} data - Form data
 * @returns {Object} Data with policies mapped to applicants
 */
function mapHealthInsuranceToApplicants(data) {
  // Create a deep copy to avoid mutations
  const result = JSON.parse(JSON.stringify(data));

  // Map Medicare plans to applicants
  result.medicare.forEach(plan => {
    result.applicants
      .filter(
        applicant =>
          plan.medicareParticipant === toHash(applicant.applicantSSN),
      )
      .forEach(applicant => {
        // Initialize Medicare array if it doesn't exist
        applicant.medicare = applicant.medicare || [];
        applicant.medicare.push(plan);
        applicant.applicantMedicareAdvantage = plan.medicarePlanType === 'c';
      });
  });

  // Map health insurance policies to applicants
  result.healthInsurance.forEach(policy => {
    // Get hashes of applicants participating in this policy
    const participantHashes = getTrueKeys(policy.healthcareParticipants);

    result.applicants
      .filter(applicant =>
        participantHashes.includes(toHash(applicant.applicantSSN)),
      )
      .forEach(applicant => {
        // Initialize health insurance array
        applicant.healthInsurance = applicant.healthInsurance || [];

        // Format middle name as initial
        if (applicant.applicantName?.middle) {
          applicant.applicantName.middle =
            applicant.applicantName.middle.charAt(0) || '';
        }

        // Combine street address fields
        if (applicant.applicantAddress) {
          applicant.applicantAddress = concatStreets(
            applicant.applicantAddress,
          );
        }

        // Add policy and set flag
        applicant.healthInsurance.push(policy);
        applicant.hasOtherHealthInsurance = true;
      });
  });

  // Add current date
  result.certificationDate = new Date().toISOString().split('T')[0];
  return result;
}

/**
 * Collects all supporting documents across applicants and policies
 * @param {Object} data - Form data
 * @returns {Array} Array of supporting documents
 */
function collectSupportingDocuments(data) {
  // Get top-level supporting docs
  const topLevelDocs = getObjectsWithAttachmentId(data, 'confirmationCode');

  // Collect docs from insurance policies and Medicare
  const policyDocs = [];
  ['healthInsurance', 'medicare'].forEach(key => {
    data[key].forEach(item => {
      const docs = getObjectsWithAttachmentId(item, 'confirmationCode');
      policyDocs.push(...docs);
    });
  });

  // Collect and enhance applicant supporting docs
  const applicantDocs = [];
  data.applicants.forEach(applicant => {
    if (applicant.applicantSupportingDocuments?.length) {
      applicant.applicantSupportingDocuments.forEach(doc => {
        if (doc) {
          // Add applicant name to document for clarity
          applicantDocs.push({
            ...doc,
            applicantName: applicant.applicantName,
          });
        }
      });
    }
  });

  // Combine all documents
  return [...topLevelDocs.flat(), ...policyDocs, ...applicantDocs];
}

/**
 * Main transformer function that prepares form data for submission
 * @param {Object} formConfig - Form configuration
 * @param {Object} form - Form data
 * @returns {string} JSON string of transformed data
 */
export default function transformForSubmit(formConfig, form) {
  // First transform using the forms-system transformer
  const initialTransform = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  // Concat streets for addresses
  const withConcatAddresses = {
    ...initialTransform,
    sponsorAddress: initialTransform.sponsorAddress
      ? concatStreets(initialTransform.sponsorAddress)
      : initialTransform.sponsorAddress,
    certifierAddress: initialTransform.certifierAddress
      ? concatStreets(initialTransform.certifierAddress)
      : initialTransform.certifierAddress,
  };

  const currentDate = formatDate(new Date().toISOString().split('T')[0]) || '';

  // Create certification data based on certifier role
  const certificationData =
    withConcatAddresses.certifierRole === 'applicant'
      ? { date: currentDate }
      : {
          date: currentDate,
          lastName: withConcatAddresses.certifierName?.last || '',
          middleInitial: withConcatAddresses.certifierName?.middle || '',
          firstName: withConcatAddresses.certifierName?.first || '',
          phoneNumber: withConcatAddresses.certifierPhone || '',
          relationship: getTrueKeys(
            withConcatAddresses.certifierRelationship?.relationshipToVeteran ||
              {},
          ).join('; '),
          streetAddress:
            withConcatAddresses.certifierAddress?.streetCombined || '',
          city: withConcatAddresses.certifierAddress?.city || '',
          state: withConcatAddresses.certifierAddress?.state || '',
          postalCode: withConcatAddresses.certifierAddress?.postalCode || '',
        };

  // Find spouse's marriage date if exists
  const marriageDate = withConcatAddresses.applicants?.find(
    applicant =>
      applicant?.applicantRelationshipToSponsor?.relationshipToVeteran ===
        'spouse' && applicant?.dateOfMarriageToSponsor,
  )?.dateOfMarriageToSponsor;

  // Create veteran data
  const veteranData = {
    fullName: withConcatAddresses.sponsorName || {},
    ssnOrTin: withConcatAddresses.sponsorSsn || '',
    dateOfBirth: formatDate(withConcatAddresses.sponsorDob) || '',
    phoneNumber: withConcatAddresses.sponsorPhone || '',
    address: withConcatAddresses.sponsorAddress || {},
    sponsorIsDeceased: withConcatAddresses.sponsorIsDeceased,
    dateOfDeath: formatDate(withConcatAddresses.sponsorDOD) || '',
    dateOfMarriage: formatDate(marriageDate) || '',
    isActiveServiceDeath: withConcatAddresses.sponsorDeathConditions,
  };

  // Construct initial data for OHI transformation
  const initialData = {
    veteran: veteranData,
    applicants: transformApplicants(withConcatAddresses.applicants || []),
    healthInsurance: withConcatAddresses.healthInsurance || [],
    medicare: withConcatAddresses.medicare || [],
    certification: certificationData,
    supportingDocs: [],
  };

  // Apply OHI transformation and collect supporting documents
  const transformedData = mapHealthInsuranceToApplicants(initialData);
  transformedData.supportingDocs = collectSupportingDocuments(transformedData);

  // Check if any applicants are over 65
  transformedData.hasApplicantOver65 = transformedData.applicants.some(
    applicant => getAgeInYears(applicant.applicantDob) >= 65,
  );

  // Add certifier data
  transformedData.certifierRole = withConcatAddresses.certifierRole;
  transformedData.statementOfTruthSignature =
    withConcatAddresses.statementOfTruthSignature;

  // Add primary contact info for backend notifications
  transformedData.primaryContactInfo = {
    name: withConcatAddresses.certifierName,
    email: withConcatAddresses.certifierEmail,
    phone: withConcatAddresses.certifierPhone,
  };

  // Return JSON string with form number
  return JSON.stringify({
    ...transformedData,
    formNumber: formConfig.formId,
  });
}
