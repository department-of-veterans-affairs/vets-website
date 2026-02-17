import { isAfter } from 'date-fns';
import {
  stringifyFormReplacer,
  transformForSubmit,
} from 'platform/forms-system/src/js/helpers';
import set from 'platform/utilities/data/set';
import recordEvent from 'platform/monitoring/record-event';
import { hasLowDisabilityRating } from '../utils/helpers';

/**
 * Map file attachment data to determine if any of the files are the
 * Veteran's DD214
 * @param {Array} attachments - an array of files from the form data
 * @returns {Array} - an array of properly-formatted file attachment data
 */
const sanitizeAttachments = attachments => {
  return attachments.map(item => {
    const { name, size, confirmationCode, attachmentId } = item;
    const isDD214 = attachmentId === '1';
    return { name, size, confirmationCode, dd214: isDD214 };
  });
};

/**
 * Map dependent data based on conditional logic within the loop
 * @param {Array} dependents - an array of dependents from the form data
 * @returns {Array} - an array of properly-formatted dependent data
 */
const sanitizeDependents = dependents => {
  return dependents.map(item => ({
    ...item,
    grossIncome: item.grossIncome || 0,
    netIncome: item.netIncome || 0,
    otherIncome: item.otherIncome || 0,
    dependentEducationExpenses: item.dependentEducationExpenses || 0,
  }));
};

/**
 * Map necessary form data to prepare for submission
 * @param {Object} formConfig - the object containing all necessary form pages
 * and config settings
 * @param {Object} form - the state object that holds the form data
 * @returns {Object} - an object containing the form submission payload
 */
export const submitTransformer = (
  formConfig,
  form,
  disableAnalytics = false,
) => {
  const logErrorToDatadog = error =>
    window.DD_LOGS?.logger.error('HCA Submit Transformer error', {}, error);
  let dataToMap = JSON.parse(transformForSubmit(formConfig, form));

  // map Veteran address data if mailing and home addresses match
  if (form.data['view:doesMailingMatchHomeAddress']) {
    const { veteranAddress } = dataToMap;
    dataToMap = set('veteranHomeAddress', veteranAddress, dataToMap);
  }

  // map compensation type for short form-eligible data
  if (!hasLowDisabilityRating(form.data) && !dataToMap.vaCompensationType) {
    dataToMap = set('vaCompensationType', 'highDisability', dataToMap);
  }

  // map file attachments
  const { attachments } = form.data;
  if (attachments instanceof Array) {
    const sanitizedAttachments = sanitizeAttachments(attachments);
    dataToMap = set('attachments', sanitizedAttachments, dataToMap);
  }

  // map dependents
  const { dependents } = dataToMap;
  if (dependents?.length) {
    const sanitizedDependents = sanitizeDependents(dependents);
    dataToMap = set('dependents', sanitizedDependents, dataToMap);
  } else {
    dataToMap = set('dependents', [], dataToMap);
  }

  // map insurance policies
  const { providers } = dataToMap;
  dataToMap = set('isCoveredByHealthInsurance', !!providers?.length, dataToMap);

  let gaClientId;
  if (!disableAnalytics) {
    // add logging to track user volume of forms submitted with specific questions answered
    const { lastDischargeDate } = form.data;
    const isDischargeAfterToday = isAfter(
      new Date(lastDischargeDate),
      new Date(),
    );
    if (isDischargeAfterToday) {
      recordEvent({
        event: 'hca-future-discharge-date-submission',
      });
    }

    // populate Google Analytics data
    try {
      // eslint-disable-next-line no-undef
      gaClientId = ga.getAll()[0].get('clientId');
    } catch (e) {
      // lets not break submission because of any GA issues
    }
  }

  // stringify form data for submission
  // NOTE: we don’t want to remove dependents in the normal empty value clean-up
  try {
    const replacer = (key, value) => {
      if (key === 'dependents') return value;
      return stringifyFormReplacer(key, value);
    };
    const dataToSubmit = JSON.stringify(dataToMap, replacer) || '{}';

    return JSON.stringify({
      form: dataToSubmit,
      asyncCompatible: true,
      gaClientId,
    });
  } catch (error) {
    logErrorToDatadog(error);
    return '{}';
  }
};
