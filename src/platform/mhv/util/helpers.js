import {
  formatDateLong,
  focusElement,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { reportGeneratedBy } from './constants';

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
  const dob = formatDateLong(user.dob);
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
  const modal = document.querySelector('#modal-crisisline');
  modal.setAttribute(
    'class',
    `${modal.getAttribute('class')} va-overlay--open`,
  );
  focusElement(document.querySelector('a[href="tel:988"]'));
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
