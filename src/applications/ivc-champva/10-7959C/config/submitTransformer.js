import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  concatStreets,
  getObjectsWithAttachmentId,
} from '../../shared/utilities';
import { FEATURE_TOGGLES } from '../hooks/useDefaultFormData';

/**
 * Builds primary contact information object from form data
 * @param {Object} data - The form data
 * @returns {Object} Primary contact information with name, email, and phone
 */
const buildPrimaryContact = data => ({
  name: data.applicantName,
  email: data.certifierEmail ?? false,
  phone: data.applicantPhone ?? false,
});

/**
 * Removes supporting document properties from medicare and healthInsurance arrays
 * @param {Object} applicant - The applicant object
 * @returns {Object} Applicant with cleaned medicare and healthInsurance arrays
 */
const cleanSupportingDocs = applicant => {
  const cleanArray = arr =>
    arr?.map(item =>
      // remove any property that is a document object (has confirmationCode)
      Object.fromEntries(
        Object.entries(item).filter(([_, value]) => {
          // filter out objects with confirmationCode
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return !value.confirmationCode;
          }
          return true;
        }),
      ),
    );

  return {
    ...applicant,
    ...(applicant.medicare && { medicare: cleanArray(applicant.medicare) }),
    ...(applicant.healthInsurance && {
      healthInsurance: cleanArray(applicant.healthInsurance),
    }),
  };
};

/**
 * Collects all supporting documents across medicare and health insurance
 * @param {Object} data - Form data
 * @returns {Array} Array of supporting documents
 */
const collectSupportingDocuments = data => {
  const medicareDocs = (data.medicare ?? []).flatMap(item =>
    getObjectsWithAttachmentId(item, 'confirmationCode'),
  );

  const healthInsuranceDocs = (data.healthInsurance ?? []).flatMap(item =>
    getObjectsWithAttachmentId(item, 'confirmationCode'),
  );

  return [...healthInsuranceDocs, ...medicareDocs];
};

/**
 * Extracts all keys starting with 'applicant' from data and creates an applicant object
 * Processes address concatenation if applicantAddress exists
 * @param {Object} data - The form data
 * @returns {Object} Object containing applicant fields
 */
const extractApplicantFields = data => {
  const applicantObj = Object.keys(data)
    .filter(key => key.startsWith('applicant'))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  if (applicantObj.applicantAddress) {
    applicantObj.applicantAddress = concatStreets(
      applicantObj.applicantAddress,
    );
  }

  return applicantObj;
};

/**
 * Extracts all keys starting with 'medicare' from data and creates a medicare object
 * @param {Object} data - The form data
 * @returns {Object} Object containing medicare fields
 */
const extractMedicareFields = data => {
  const medicareObj = Object.keys(data)
    .filter(key => key.startsWith('medicare'))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  // remap keys to match backend expectations
  const keyMappings = {
    medicarePartDStatus: 'hasMedicarePartD',
  };

  return Object.fromEntries(
    Object.entries(medicareObj).map(([key, value]) => [
      keyMappings[key] || key,
      value,
    ]),
  );
};

/**
 * Formats date strings from YYYY-MM-DD to MM-DD-YYYY
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date string
 */
const formatDateString = dateStr => {
  if (!dateStr || dateStr.length !== 10) return dateStr;
  const [year, month, day] = dateStr.split('-');
  return `${month}-${day}-${year}`;
};

/**
 * Maps medicare fields and healthInsurance array into the applicant object
 * @param {Object} applicant - The applicant object
 * @param {Object} data - The full form data
 * @returns {Object} Applicant with nested medicare and healthInsurance
 */
const nestInsuranceInApplicant = (applicant, data) => {
  const medicareFields = extractMedicareFields(data);
  const hasMedicareFields = Object.keys(medicareFields).length > 0;
  return {
    ...applicant,
    ...(hasMedicareFields && { medicare: [medicareFields] }),
    healthInsurance: data.healthInsurance ?? [],
  };
};

/**
 * Recursively transforms date fields from YYYY-MM-DD to MM-DD-YYYY format
 * @param {Object|Array} obj - The object or array to transform
 * @returns {Object|Array} New object/array with transformed dates
 */
const transformDates = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(item => transformDates(item));

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (key.toLowerCase().includes('date') && typeof value === 'string') {
        return [key, formatDateString(value)];
      }
      if (value && typeof value === 'object') {
        return [key, transformDates(value)];
      }
      return [key, value];
    }),
  );
};

/**
 * Main transformer function that prepares form data for submission
 * @param {Object} formConfig - Form configuration
 * @param {Object} form - Form object
 * @returns {string} JSON string of transformed data
 */
export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );
  const copyOfData = JSON.parse(JSON.stringify(transformedData));
  const isRev2025Enabled = form.data[`view:${FEATURE_TOGGLES[0]}`];

  if (isRev2025Enabled) {
    const applicantFields = extractApplicantFields(copyOfData);
    const applicantWithInsurance = nestInsuranceInApplicant(
      applicantFields,
      copyOfData,
    );

    const supportingDocs = collectSupportingDocuments(applicantWithInsurance);
    const cleanedApplicant = cleanSupportingDocs(applicantWithInsurance);
    const primaryContactInfo = buildPrimaryContact(copyOfData);

    // remove fields mapped to the applicants array
    const prefixesToRemove = ['applicant', 'medicare', 'healthInsurance'];
    Object.keys(copyOfData).forEach(key => {
      if (prefixesToRemove.some(prefix => key.startsWith(prefix))) {
        delete copyOfData[key];
      }
    });

    copyOfData.applicants = [cleanedApplicant];
    copyOfData.supportingDocs = supportingDocs;
    copyOfData.primaryContactInfo = primaryContactInfo;
  } else {
    copyOfData.applicantMedicareAdvantage =
      copyOfData.applicantMedicareClass === 'advantage';

    copyOfData.hasOtherHealthInsurance =
      copyOfData.applicantHasPrimary || copyOfData.applicantHasSecondary;

    if (copyOfData.applicantAddress) {
      copyOfData.applicantAddress = concatStreets(copyOfData.applicantAddress);
    }

    copyOfData.supportingDocs = getObjectsWithAttachmentId(copyOfData);
    copyOfData.primaryContactInfo = buildPrimaryContact(copyOfData);
  }

  const today = new Date().toISOString().split('T')[0];
  Object.assign(copyOfData, transformDates(copyOfData));
  copyOfData.certificationDate = formatDateString(today);

  copyOfData.statementOfTruthSignature = copyOfData.signature;

  return JSON.stringify({
    ...copyOfData,
    formNumber: formConfig.formId,
  });
}
