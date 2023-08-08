import moment from 'moment-timezone';
import * as Sentry from '@sentry/browser';
import { snakeCase } from 'lodash';
import { emptyField, interpretationMap } from './constants';

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
 * @param {String} name
 * @param {Base64String} base64Str
 * @returns {Undefined} downloads the file
 */
export const downloadFile = (name, base64Str) => {
  const pdf = `data:application/pdf;base64, ${base64Str}`;
  const link = document.createElement('a');
  link.href = pdf;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

/**
 * @param {Object} record
 * @returns {Array of Strings} array of reactions
 */
export const getReactions = record => {
  const reactions = [];
  if (!record || !record.reaction) return reactions;
  record.reaction.forEach(rea => {
    rea.manifestation.forEach(man => reactions.push(man.text));
  });
  return reactions;
};

/**
 * @param {Object} record
 * @returns {Array of Strings} array of names, separated by a comma
 */
export const getNames = record => {
  if (!record) return '';
  return record.code.coding.map(code => code.display).join(', ');
};

/**
 * Concatenate all the record.category[].text values in a FHIR record.
 *
 * @param {Object} record
 * @returns {String} list of text values, separated by a comma
 */
export const concatCategoryCodeText = record => {
  const textFields = record.category
    .filter(category => category.text)
    .map(category => category.text);

  return textFields.join(', ');
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
  const textFields = record.interpretation
    .filter(interpretation => interpretation.text)
    .map(
      interpretation =>
        interpretationMap[interpretation.text] || interpretation.text,
    );
  return textFields.join(', ');
};

/**
 * @param {*} observation - a FHIR Observation object
 * @returns {String} the value with units, e.g. "5 ml"
 */
export const getObservationValueWithUnits = observation => {
  if (observation.valueQuantity) {
    return `${observation.valueQuantity.value} ${
      observation.valueQuantity.unit
    }`;
  }
  return null;
};

/**
 * @param {Array} list
 * @returns {String} array of strings, separated by a comma
 */
export const processList = list => {
  if (list?.length > 1) return list.join('. ');
  if (list?.length === 1) return list.toString();
  return emptyField;
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
 * @param {Any} obj
 * @returns {Boolean} true if obj is an array and has at least one item
 */
export const isArrayAndHasItems = obj => {
  return Array.isArray(obj) && obj.length;
};
