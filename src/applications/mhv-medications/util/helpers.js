import moment from 'moment-timezone';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import * as Sentry from '@sentry/browser';
import {
  EMPTY_FIELD,
  imageRootUri,
  medicationsUrls,
  PRINT_FORMAT,
  DOWNLOAD_FORMAT,
} from './constants';

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} fromatted timestamp
 */
export const dateFormat = (timestamp, format = null) => {
  if (timestamp) {
    return moment
      .tz(timestamp, 'America/New_York')
      .format(format || 'MMMM D, YYYY');
  }
  return EMPTY_FIELD;
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
    throw error;
  }
};

/**
 * @param {String} fieldValue value that is being validated
 */
export const validateField = fieldValue => {
  if (fieldValue || fieldValue === 0) {
    return fieldValue;
  }
  return EMPTY_FIELD;
};

/**
 * @param {String} fieldValue value that is being validated
 */
export const getImageUri = fieldValue => {
  const folderNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let folderName = fieldValue
    ? fieldValue.replace(/^0+(?!$)/, '').substring(0, 1)
    : '';
  const fileName = `NDC${fieldValue}.jpg`;
  // check if the foldername is one of the listed folders. if not, set folder name to “other”
  if (!folderNames.includes(folderName)) {
    folderName = 'other';
  }

  return `${imageRootUri + folderName}/${fileName}`;
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
 * @param {Any} obj
 * @returns {Boolean} true if obj is an array and has at least one item
 */
export const isArrayAndHasItems = obj => {
  return Array.isArray(obj) && obj.length;
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
 * Create a refill history item for the original fill, using the prescription
 * @param {Object} Prescription object
 * @returns {Object} Object similar to or marching an rxRefillHistory object
 */
export const createOriginalFillRecord = prescription => {
  const {
    backImprint,
    cmopDivisionPhone,
    cmopNdcNumber,
    color,
    dialCmopDivisionPhone,
    dispensedDate,
    frontImprint,
    prescriptionId,
    prescriptionName,
    shape,
  } = prescription;
  return {
    backImprint,
    cmopDivisionPhone,
    cmopNdcNumber,
    color,
    dialCmopDivisionPhone,
    dispensedDate,
    frontImprint,
    prescriptionId,
    prescriptionName,
    shape,
  };
};

/**
 * Create a plain text string for when a medication description can't be provided
 * @param {String} Phone number, as a string
 * @returns {String} A string suitable for display anywhere plain text is preferable
 */
export const createNoDescriptionText = phone => {
  let dialFragment = '';
  if (phone) {
    dialFragment = ` at ${phone}`;
  }
  return `No description available. Call your pharmacy${dialFragment} if you need help identifying this medication.`;
};

/**
 * Create a plain text string to display the correct text for a VA pharmacy phone number
 * @param {String} Phone number, as a string
 */
export const createVAPharmacyText = (phone = null) => {
  let dialFragment = '';
  if (phone) {
    dialFragment = `at ${phone}`;
  }
  return `your VA pharmacy ${dialFragment}`.trim();
};

/**
 * Create pagination numbers
 * @param {Number} currentPage
 * @param {Number} totalPages
 * @param {Number} list
 * @param {Number} maxPerPage
 * @returns {Array} Array of numbers
 */
export const fromToNumbs = (page, total, listLength, maxPerPage) => {
  if (listLength < 1) {
    return [0, 0];
  }
  const from = (page - 1) * maxPerPage + 1;
  const to = Math.min(page * maxPerPage, total);
  return [from, to];
};

/**
 * Creates the breadcrumb state based on the current location path.
 * This function returns an array of breadcrumb objects for rendering in UI component.
 * It should be called whenever the route changes if breadcrumb updates are needed.
 *
 * @param {Object} location - The location object from React Router, containing the current pathname.
 * @param {String} prescriptionId - A prescription object, used for the details page.
 * @param {Object} pagination - The pagination object used for the prescription list page.
 * @returns {Array<Object>} An array of breadcrumb objects with `url` and `label` properties.
 */
export const createBreadcrumbs = (location, prescription, currentPage) => {
  const { pathname } = location;
  const defaultBreadcrumbs = [
    {
      href: medicationsUrls.VA_HOME,
      label: 'VA.gov home',
    },
    {
      href: medicationsUrls.MHV_HOME,
      label: 'My HealtheVet',
    },
  ];
  const {
    subdirectories,
    MEDICATIONS_ABOUT,
    MEDICATIONS_URL,
    MEDICATIONS_REFILL,
  } = medicationsUrls;

  if (pathname.includes(subdirectories.ABOUT)) {
    return [
      ...defaultBreadcrumbs,
      { href: MEDICATIONS_ABOUT, label: 'About medications' },
    ];
  }
  if (pathname === subdirectories.BASE) {
    return defaultBreadcrumbs.concat([
      { href: MEDICATIONS_ABOUT, label: 'About medications' },
      {
        href: `${MEDICATIONS_URL}?page=${currentPage || 1}`,
        label: 'Medications',
      },
    ]);
  }
  if (pathname === subdirectories.REFILL) {
    return defaultBreadcrumbs.concat([
      { href: MEDICATIONS_ABOUT, label: 'About medications' },
      { href: MEDICATIONS_REFILL, label: 'Refill prescriptions' },
    ]);
  }
  return [];
};

export const getErrorTypeFromFormat = format => {
  switch (format) {
    case PRINT_FORMAT.PRINT:
    case PRINT_FORMAT.PRINT_FULL_LIST:
      return 'print';
    case DOWNLOAD_FORMAT.PDF:
    case DOWNLOAD_FORMAT.TXT:
      return 'download';
    default:
      return 'print';
  }
};

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
 * This function sanitizes the input how we want it displayed when
 * receiving the HTML string from the Krames API
 *
 * @param {String} htmlString - HTML string from the Krames API
 */
export const sanitizeKramesHtmlStr = htmlString => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // This section is to address removing <body> and <page> tags
  if (tempDiv.querySelector('body')) {
    tempDiv.innerHTML = tempDiv.querySelector('body').innerHTML;
  }
  if (tempDiv.querySelector('page')) {
    tempDiv.innerHTML = tempDiv.querySelector('page').innerHTML;
  }

  // This section is to address removing <h1> tags
  tempDiv.querySelectorAll('h1').forEach(h1 => {
    const h2 = document.createElement('h2');
    h2.innerHTML = h1.innerHTML;
    h1.replaceWith(h2);
  });

  // This section is to address <h3> tags coming before <h2> tags
  tempDiv.querySelectorAll('h3').forEach(h3 => {
    let sibling = h3.nextElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === 'h2') {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = h3.innerHTML;
        h3.replaceWith(paragraph);
        break;
      }
      sibling = sibling.nextElementSibling;
    }
  });

  const processUl = ul => {
    const nestedUls = ul.querySelectorAll('ul');

    // This section is to address nested <ul> tags
    nestedUls.forEach(nestedUl => {
      while (nestedUl.firstChild) {
        ul.appendChild(nestedUl.firstChild);
      }
      nestedUl.remove();
    });

    // This section is to address <p> tags inside of <ul> tags
    const pTags = ul.querySelectorAll('p');
    pTags.forEach(pTag => {
      const fragmentBefore = document.createDocumentFragment(); // Fragment to hold nodes before <p> tag
      const fragmentAfter = document.createDocumentFragment(); // Fragment to hold nodes after <p> tag
      let isBefore = true;

      Array.from(ul.childNodes).forEach(child => {
        if (child === pTag) {
          isBefore = false;
          return;
        }

        if (isBefore) {
          // Add non-empty nodes before <p> tag to fragmentBefore
          if (
            child.nodeType !== Node.TEXT_NODE ||
            child.textContent.trim().length > 0
          ) {
            fragmentBefore.appendChild(child.cloneNode(true));
          }
        } else if (
          // Add non-empty nodes after <p> tag to fragmentAfter
          child.nodeType !== Node.TEXT_NODE ||
          child.textContent.trim().length > 0
        ) {
          fragmentAfter.appendChild(child.cloneNode(true));
        }
      });

      // If there are nodes before <p> tag, create new <ul> and insert it
      if (fragmentBefore.childNodes.length > 0) {
        const newUlBefore = document.createElement('ul');
        while (fragmentBefore.firstChild) {
          newUlBefore.appendChild(fragmentBefore.firstChild);
        }
        if (ul.parentNode) {
          ul.parentNode.insertBefore(newUlBefore, ul);
        }
      }

      // Insert <p> tag before the original <ul>
      if (ul.parentNode) {
        ul.parentNode.insertBefore(pTag, ul);
      }

      // If there are nodes after <p> tag, create new <ul> and insert it
      if (fragmentAfter.childNodes.length > 0) {
        const newUlAfter = document.createElement('ul');
        while (fragmentAfter.firstChild) {
          newUlAfter.appendChild(fragmentAfter.firstChild);
        }
        if (ul.parentNode) {
          ul.parentNode.insertBefore(newUlAfter, ul);
        }
      }

      ul.remove();
    });
  };

  tempDiv.querySelectorAll('ul').forEach(processUl);

  // This section is to address all caps text inside of <h2> tags
  tempDiv.querySelectorAll('h2').forEach(heading => {
    const h2 = document.createElement('h2');
    let words = heading.textContent.toLowerCase().split(' ');
    words = words.map((word, index) => {
      if (index === 0 || word === 'i') {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
    h2.textContent = words.join(' ');
    heading.replaceWith(h2);
  });

  // This section is to address text with no tags
  Array.from(tempDiv.childNodes).forEach(node => {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.textContent.trim().length > 0
    ) {
      const paragraph = document.createElement('p');
      paragraph.textContent = node.textContent;
      node.replaceWith(paragraph);
    }
  });

  return tempDiv.innerHTML;
};
