import { format } from 'date-fns';
import * as Sentry from '@sentry/browser';
import { datadogRum } from '@datadog/browser-rum';
import { reportGeneratedBy } from './constants';
import { formatBirthDateLong } from './dateUtil';

/**
 * @param {Object} nameObject {first, middle, last, suffix}
 * @returns {String} formatted timestamp
 */
export const formatName = ({ first, middle, last, suffix }) => {
  let name = `${last}, ${first}`;
  if (!first) {
    name = `${last}`;
  }
  if (middle) name += ` ${middle}`;
  if (suffix) name += `, ${suffix}`;
  return name;
};

/**
 * @param {Object} user user profile object from redux store (state.user.profile)
 * @param {Object} title title of the doc (displayed at the top of the doc)
 * @param {Object} subject subject of the doc (metadata)
 * @param {Object} preface preface below the title (displayed below the title)
 * @returns {String} formatted timestamp
 */
export const generatePdfScaffold = (user, title, subject, preface) => {
  const name = formatName(user.userFullName);
  let dob = '';
  try {
    dob = formatBirthDateLong(user.dob);
  } catch (error) {
    dob = '';
  }
  const scaffold = {
    headerLeft: name,
    headerRight: `Date of birth: ${dob}`,
    headerBanner: [
      {
        text:
          'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at ',
      },
      {
        text: '988',
        weight: 'bold',
      },
      {
        text: '. Then select 1.',
      },
    ],
    footerLeft: reportGeneratedBy,
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    title,
    subject,
  };
  if (preface) scaffold.preface = preface;
  return scaffold;
};

/**
 * Sets a page title of the document
 * @param {String} newTitle title of the page, displayed on the browsers title bar
 */
export const updatePageTitle = newTitle => {
  document.title = newTitle;
};

/**
 * Opens the veterans Crisis modal (the modal that appears when clicking the red banner in the header
 * (or footer on mobile) to connect to the Crisis Line)
 */
export const openCrisisModal = () => {
  document.dispatchEvent(new CustomEvent('vaCrisisLineModalOpen'));
};

/**
 * Retrieves the pharmacy phone number from a prescription object.
 *
 * The function checks for the pharmacy phone number in the following order:
 * 1. `prescription.cmopDivisionPhone`
 * 2. `prescription.dialCmopDivisionPhone`
 * 3. `prescription.rxRfRecords[].cmopDivisionPhone`
 * 4. `prescription.rxRfRecords[].dialCmopDivisionPhone`
 *
 * @param {Object} prescription - The prescription object containing pharmacy details.
 * @returns {String|null} The pharmacy phone number if found, otherwise `null`.
 */
export const pharmacyPhoneNumber = prescription => {
  if (prescription.cmopDivisionPhone) {
    return prescription.cmopDivisionPhone;
  }
  if (prescription.dialCmopDivisionPhone) {
    return prescription.dialCmopDivisionPhone;
  }

  if (prescription.rxRfRecords && prescription.rxRfRecords.length > 0) {
    const cmopDivisionPhone = prescription.rxRfRecords.find(item => {
      if (item.cmopDivisionPhone) return item.cmopDivisionPhone;
      return null;
    })?.cmopDivisionPhone;
    if (cmopDivisionPhone) return cmopDivisionPhone;

    const dialCmopDivisionPhone = prescription.rxRfRecords.find(item => {
      if (item.dialCmopDivisionPhone) return item.dialCmopDivisionPhone;
      return null;
    })?.dialCmopDivisionPhone;
    if (dialCmopDivisionPhone) return dialCmopDivisionPhone;
  }
  return null;
};

/**
 * Returns the date and time for file download name
 * @param {Object} user user object from redux store
 * @returns the user's name with the date and time in the format John-Doe-M-D-YYYY_hhmmssa
 */
export const getNameDateAndTime = user => {
  const now = new Date();
  const formattedDate = format(now, 'M-d-yyyy_hhmmaaa'); // Note: `aa` gives lowercase am/pm in some locales
  return `${user.userFullName.first}-${
    user.userFullName.last
  }-${formattedDate}`;
};

/**
 * @param {Object} nameObject {first, middle, last, suffix}
 * @returns {String} formatted timestamp
 */
export const formatNameFirstLast = ({ first, middle, last, suffix }) => {
  let returnName = '';

  let firstName = `${first}`;
  let lastName = `${last}`;

  if (!first) {
    return lastName;
  }
  if (middle) firstName += ` ${middle}`;
  if (suffix) lastName += `, ${suffix}`;

  returnName = `${firstName} ${lastName}`;

  return returnName;
};

/**
 * Formats the user's date of birth into a long-form date string.
 *
 * If a date of birth is present in the user profile, it returns the formatted date
 * (e.g., "January 1, 1980"). If not, it returns the string "Not found".
 *
 * Also returns "Not found" if the date is invalid.
 *
 * @param {Object} userProfile - The user profile object, typically from Redux state.
 * @param {string} userProfile.dob - The user's date of birth in ISO string format.
 * @returns {string} A formatted date string or "Not found" if the DOB is missing.
 */
export const formatUserDob = userProfile => {
  if (!userProfile?.dob) return 'Not found';
  try {
    return formatBirthDateLong(userProfile.dob);
  } catch (error) {
    return 'Not found';
  }
};

/**
 * @param {Error} error javascript error
 * @param {String} feature name of the app and feature sending the error i.e. 'Medical Records - Vaccines - PDF generation error'
 * @returns {undefined}
 */
export const sendErrorToSentry = (error, feature) => {
  Sentry.captureException(error);
  Sentry.captureMessage(`MHV - ${feature}`);
};

/**
 * Cache the dynamic import promise to avoid redundant network requests
 * and improve performance when makePdf is called multiple times.
 */
let pdfModulePromise = null;

/**
 * Create a pdf using the platform pdf generator tool
 * @param {Boolean} pdfName what the pdf file should be named
 * @param {Object} pdfData data to be passed to pdf generator
 * @param {String} templateId the template id in the pdfGenerator utility, defaults to medicalRecords
 * @param {String} sentryErrorLabel name of the app and feature where the call originated
 * @param {Boolean} runningUnitTest pass true when running unit tests because calling generatePdf will break unit tests
 */
export const makePdf = async (
  pdfName,
  pdfData,
  templateId,
  sentryErrorLabel,
  runningUnitTest,
) => {
  try {
    // Use cached module promise if available, otherwise create a new one
    if (!pdfModulePromise) {
      pdfModulePromise = import('@department-of-veterans-affairs/platform-pdf/exports');
    }

    // Wait for the module to load and extract the generatePdf function
    const { generatePdf } = await pdfModulePromise;

    if (!runningUnitTest) {
      await generatePdf(templateId, pdfName, pdfData);
    }
  } catch (error) {
    // Reset the pdfModulePromise so subsequent calls can try again
    pdfModulePromise = null;
    datadogRum.addError(error, { feature: sentryErrorLabel });
    sendErrorToSentry(error, sentryErrorLabel);
    // Re-throw so callers can handle the error appropriately
    throw error;
  }
};
