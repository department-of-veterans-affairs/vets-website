import moment from 'moment-timezone';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import * as Sentry from '@sentry/browser';

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
 * @param {String} templateName must be an already created template found on platform/pdf/templates
 * @param {String} generatedFileName pdf is saved under this name
 * @param {Object} pdfData object formatted according to a pdf template guideline set by platform
 */
export const generateMedicationsPDF = async (
  templateName,
  generatedFileName,
  pdfData,
) => {
  try {
    await generatePdf(templateName, generatedFileName, pdfData);
  } catch (error) {
    Sentry.captureException(error);
    Sentry.captureMessage('vets_mhv_medications_pdf_generation_error');
    // TODO: Once UCD gives a flow on how to present to the  user when something goes wrong with the pdf generation
    // Error logging/presentation goes here...
  }
};

/**
 * @param {String} fieldValue value that is being validated
 * @param {string} date if the value needs to be returend as a date, this param should be passed as the string "date",
 * otherwise it is set to false by default
 */
export const validateField = (fieldValue, date = false) => {
  if (fieldValue) {
    if (date === 'date') {
      return dateFormat(fieldValue);
    }
    return fieldValue;
  }
  return 'None noted';
};
