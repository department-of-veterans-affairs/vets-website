import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
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
          'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis line at ',
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
 * (or footer on mobile) to connect to the crisis line)
 */
export const openCrisisModal = () => {
  document.dispatchEvent(new CustomEvent('vaCrisisLineModalOpen'));
};
