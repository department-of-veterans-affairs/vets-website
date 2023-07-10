import moment from 'moment-timezone';
import { emptyField } from './constants';

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
 * @param {*} type
 * @param {*} dosage
 * @returns {String} type and dosage combined, type or dosage or neither message
 */
export const typeAndDose = (type, dosage) => {
  if (type && dosage) {
    return `${type}, ${dosage}`;
  }

  return type || dosage || 'There is no type or dosage reported at this time.';
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
    rea.manifestation.forEach(man => {
      man.coding.forEach(cod => reactions.push(cod.display));
    });
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
 * @param {Array} list
 * @returns {String} array of strings, separated by a comma
 */
export const processList = list => {
  if (list?.length > 1) return list.join('. ');
  if (list.length === 1) return list.toString();
  return emptyField;
};
