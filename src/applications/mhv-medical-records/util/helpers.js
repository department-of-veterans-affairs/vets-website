import moment from 'moment-timezone';
import * as Sentry from '@sentry/browser';
import { snakeCase } from 'lodash';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { format as dateFnsFormat, parseISO } from 'date-fns';
import {
  EMPTY_FIELD,
  interpretationMap,
  refreshPhases,
  VALID_REFRESH_DURATION,
} from './constants';

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} formatted timestamp
 */
export const dateFormat = (timestamp, format = null) => {
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM D, YYYY, h:mm a z');
};

/**
 * @param {*} datetime (2017-08-02T09:50:57-04:00)
 * @returns {String} formatted datetime (August 2, 2017, 9:50 a.m.)
 */
export const dateFormatWithoutTimezone = datetime => {
  const withoutTimezone = datetime.substring(0, datetime.lastIndexOf('-'));
  return moment(withoutTimezone).format('MMMM D, YYYY, h:mm a');
};

/**
 * @param {Object} nameObject {first, middle, last, suffix}
 * @returns {String} formatted timestamp
 */
export const nameFormat = ({ first, middle, last, suffix }) => {
  let name = `${last}, ${first}`;
  if (middle) name += ` ${middle}`;
  if (suffix) name += `, ${suffix}`;
  return name;
};

/**
 * @param {Object} record
 * @returns {Array of Strings} array of reactions
 */
export const getReactions = record => {
  const reactions = [];
  if (!record || !record.reaction) return reactions;
  record.reaction.forEach(reaction => {
    reaction.manifestation.forEach(manifestation => {
      reactions.push(manifestation.text);
    });
  });
  return reactions;
};

/**
 * @param {Any} obj
 * @returns {Boolean} true if obj is an array and has at least one item
 */
export const isArrayAndHasItems = obj => {
  return Array.isArray(obj) && obj.length;
};

/**
 * Concatenate all the record.category[].text values in a FHIR record.
 *
 * @param {Object} record
 * @returns {String} list of text values, separated by a comma
 */
export const concatCategoryCodeText = record => {
  if (isArrayAndHasItems(record.category)) {
    const textFields = record.category
      .filter(category => category.text)
      .map(category => category.text);

    return textFields.join(', ');
  }
  return null;
};

/**
 * For every record.interpretation[].text value in a record, find the right display value
 * then concatenate them all together. If no mapping value is found for the code, the code
 * itself is displayed.
 *
 * @param {Object} record
 * @returns {String} list of interpretations, separated by a comma
 */
export const concatObservationInterpretations = record => {
  if (isArrayAndHasItems(record.interpretation)) {
    const textFields = record.interpretation
      .filter(interpretation => interpretation.text)
      .map(
        interpretation =>
          interpretationMap[interpretation.text] || interpretation.text,
      );
    return textFields.join(', ');
  }
  return null;
};

/**
 * @param {*} observation - a FHIR Observation object
 * @returns {String} the value with units, e.g. "5 ml"
 */
export const getObservationValueWithUnits = observation => {
  if (observation.valueQuantity) {
    return {
      observationValue: observation.valueQuantity.value,
      observationUnit: observation.valueQuantity.unit,
    };
  }
  return null;
};

/**
 * @param {Array} list
 * @returns {String} array of strings, separated by a comma
 */
export const processList = list => {
  if (Array.isArray(list)) {
    if (list?.length > 1) return list.join('. ');
    if (list?.length === 1) return list.toString();
  }
  return EMPTY_FIELD;
};

/**
 * @param {Error} error javascript error
 * @param {String} page name of the page sending the error
 * @returns {undefined}
 */
export const sendErrorToSentry = (error, page) => {
  Sentry.captureException(error);
  Sentry.captureMessage(
    `MHV - Medical Records - ${page} - PDF generation error`,
  );
};

/**
 * Macro case is naming with all letters Capitalized but the words are joined with _ ( underscore)
 * @param {String} str string
 * @returns {String} MACRO_CASE
 */
export const macroCase = str => {
  return snakeCase(str).toUpperCase();
};

/**
 * Create a pdf using the platform pdf generator tool
 * @param {Boolean} pdfName what the pdf file should be named
 * @param {Object} pdfData data to be passed to pdf generator
 * @param {String} sentryError name of the app feature where the call originated
 * @param {Boolean} runningUnitTest pass true when running unit tests because calling generatePdf will break unit tests
 * @param {String} templateId the template id in the pdfGenerator utility, defaults to medicalRecords
 */
export const makePdf = async (
  pdfName,
  pdfData,
  sentryError,
  runningUnitTest,
  templateId,
) => {
  try {
    if (!runningUnitTest) {
      await generatePdf(templateId || 'medicalRecords', pdfName, pdfData);
    }
  } catch (error) {
    sendErrorToSentry(error, sentryError);
  }
};

/**
 * Extract a contained resource from a FHIR resource's "contained" array.
 * @param {Object} resource a FHIR resource (e.g. AllergyIntolerance)
 * @param {String} referenceId an internal ID referencing a contained resource
 * @returns the specified contained FHIR resource, or null if not found
 */
export const extractContainedResource = (resource, referenceId) => {
  if (resource && isArrayAndHasItems(resource.contained) && referenceId) {
    // Strip the leading "#" from the reference.
    const strippedRefId = referenceId.substring(1);
    const containedResource = resource.contained.find(
      containedItem => containedItem.id === strippedRefId,
    );
    return containedResource || null;
  }
  return null;
};

/**
 * Extract a specimen resource from a FHIR resource's "contained" array.
 * @param {Object} record a FHIR resource (e.g. AllergyIntolerance)
 * @param {String} resourceType takes a resourceType to return a record from "contained"
 * @param {Array} referenceArray takes an array to use as a reference
 * @returns the specified contained FHIR resource, or null if not found
 */
export const extractContainedByRecourceType = (
  record,
  resourceType,
  referenceArray,
) => {
  if (record && resourceType && isArrayAndHasItems(referenceArray)) {
    const refArray = [];
    referenceArray.map(entry =>
      refArray.push(entry.reference.replace('#', '')),
    );
    const returnRecord = isArrayAndHasItems(record.contained)
      ? record.contained
          .filter(item => refArray.includes(item.id))
          .filter(item => item.resourceType === resourceType)
      : null;
    return isArrayAndHasItems(returnRecord) ? returnRecord : null;
  }
  return null;
};

/**
 * Download a text file
 * @param {String} content text file content
 * @param {String} fileName name for the text file
 */
export const generateTextFile = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

/**
 * Returns the date and time for file download name
 * @param {Object} user user object from redux store
 * @returns the user's name with the date and time in the format John-Doe-M-D-YYYY_hhmmssa
 */
export const getNameDateAndTime = user => {
  return `${user.userFullName.first}-${user.userFullName.last}-${moment()
    .format('M-D-YYYY_hhmmssa')
    .replace(/\./g, '')}`;
};

/**
 * Helper function to retrieve details for a given item.
 *
 * If a matching item is found in the list, those details are returned.
 * If no matching item is found, it fetches the details for the given id using getDetail().
 *
 * @param {string} id - The ID of the detail to retrieve.
 * @param {Array} list - The list of detail object to search in.
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Function} getDetail - The function to fetch detail's object by ID from an API.
 * @param {string} actionsGetFromList - The action type to dispatch when a matching item is found in the list.
 * @param {string} actionsGet - The action type to dispatch when a matching item is not found in the list.
 */
export const dispatchDetails = async (
  id,
  list,
  dispatch,
  getDetail,
  actionsGetFromList,
  actionsGet,
) => {
  const matchingItem = list && list.find(item => item.id === id);

  if (matchingItem) {
    dispatch({ type: actionsGetFromList, response: matchingItem });
  } else {
    const response = await getDetail(id);
    dispatch({ type: actionsGet, response });
  }
};

/**
 * Parse a value from a url using the parameter name
 * @param {String} url url
 * @param {String} paramName name for the text file
 */
export const getParamValue = (url, paramName) => {
  const getParams = new URLSearchParams(url);
  return getParams.get(`${paramName}`) ? getParams.get(`${paramName}`) : 1;
};

/**
 * Function: getActiveLinksStyle
 * Description: Determines the style for active links based on the linkPath and currentPath.
 * Pre-conditions:
 * - linkPath: A string representing the path of the link being evaluated.
 * - currentPath: A string representing the current path of the application.
 * Post-conditions:
 * - Returns 'is-active' if the link is active, otherwise returns an empty string.
 * @param {string} linkPath - The path of the link being evaluated.
 * @param {string} currentPath - The current path of the application.
 * @returns {string} - 'is-active' if the link is active, otherwise an empty string.
 */
export const getActiveLinksStyle = (linkPath, currentPath) => {
  let relativePath;

  if (linkPath === '/' && currentPath === '/') {
    return 'is-active';
  }

  const pathArr = currentPath.slice(1).split('/');

  if (
    pathArr.length > 1 &&
    pathArr.length < 5 &&
    pathArr[0] === 'labs-and-tests'
  ) {
    relativePath = '/labs-and-tests';
  } else if (pathArr.length === 3) {
    relativePath = `/${pathArr[0]}/${pathArr[1]}`;
  } else {
    relativePath = currentPath;
  }

  if (linkPath.split('/')[1] === relativePath.split('/')[1]) {
    return 'is-active';
  }

  return '';
};

/**
 * Formats the date and accounts for the lack of a 'dd' in a date
 * @param {String} str str
 */
export const formatDate = str => {
  const yearRegex = /^\d{4}$/;
  const monthRegex = /^\d{4}-\d{2}$/;
  if (yearRegex.test(str)) {
    return str;
  }
  if (monthRegex.test(str)) {
    return dateFnsFormat(parseISO(str), 'MMMM, yyyy');
  }
  return formatDateLong(str);
};

/**
 * Returns a date formatted into two parts -- a date portion and a time portion.
 *
 * @param {Date} date
 */
export const formatDateAndTime = date => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'p.m.' : 'a.m.';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timePart = `${formattedHours}:${formattedMinutes} ${period} ET`;

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const datePart = date.toLocaleDateString('en-US', options);

  return {
    date: datePart,
    time: timePart,
  };
};

/**
 * Determine whether the PHR refresh for a particular extract is stale, in progress, current, or failed.
 *
 * @param {*} retrievedDate the timestamp (in ms) that the refresh status was retrieved
 * @param {*} phrStatus the list of PHR status extracts
 * @param {*} extractType the extract for which to return the phase (e.g. 'VPR')
 * @returns {string|null} the current refresh phase, or null if parameters are invalid.
 */
export const getStatusExtractPhase = (
  retrievedDate,
  phrStatus,
  extractType,
) => {
  if (!retrievedDate || !phrStatus || !extractType) return null;
  const extractStatus = phrStatus.find(
    status => status.extract === extractType,
  );
  if (
    !extractStatus?.lastRequested ||
    !extractStatus?.lastCompleted ||
    !extractStatus?.lastSuccessfulCompleted
  ) {
    return null;
  }
  if (retrievedDate - extractStatus.lastCompleted > VALID_REFRESH_DURATION) {
    return refreshPhases.STALE;
  }
  if (extractStatus.lastCompleted < extractStatus.lastRequested) {
    return refreshPhases.IN_PROGRESS;
  }
  if (
    extractStatus.lastCompleted.getTime() !==
    extractStatus.lastSuccessfulCompleted.getTime()
  ) {
    return refreshPhases.FAILED;
  }
  return refreshPhases.CURRENT;
};
