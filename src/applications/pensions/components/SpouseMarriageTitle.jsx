import PropTypes from 'prop-types';

import get from '@department-of-veterans-affairs/platform-forms-system/get';

/**
 * @typedef {object} SpouseMarriageTitleProps
 * @property {object} formData - The form data for the marriage information
 *
 * @param {SpouseMarriageTitleProps} props - The props for the component
 * @returns {string} - The title for the spouse marriage section
 */
export default function SpouseMarriageTitle({ formData }) {
  return get(['spouseMarriages', 'length'], formData) > 1
    ? 'Spouse’s former marriages'
    : 'Spouse’s former marriage';
}

SpouseMarriageTitle.propTypes = {
  formData: PropTypes.object,
};
