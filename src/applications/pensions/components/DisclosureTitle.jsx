import get from 'platform/utilities/data/get';

/**
 * Creates a Disclosure title function that will include the spouse's full name
 * @param {string} path - current location path
 * @param {string} title - page title
 * @returns {function} DisclosureTitle component
 */
export default function createDisclosureTitle(path, title) {
  return function DisclosureTitle({ formData }) {
    let fullName;

    // A little hackish
    if (path.includes('spouse')) {
      const marriages = formData.marriages || [];
      fullName =
        get(['marriages', marriages.length - 1, 'spouseFullName'], formData) ||
        {};
    } else {
      fullName = get(path, formData) || {};
    }

    return `${fullName.first} ${fullName.last} ${title}`;
  };
}
