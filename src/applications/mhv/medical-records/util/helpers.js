import moment from 'moment-timezone';

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} fromatted timestamp
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
