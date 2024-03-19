import PropTypes from 'prop-types';

import get from '@department-of-veterans-affairs/platform-forms-system/get';

export default function SpouseMarriageTitle({ formData }) {
  return get(['spouseMarriages', 'length'], formData) > 1
    ? 'Spouse’s former marriages'
    : 'Spouse’s former marriage';
}

SpouseMarriageTitle.propTypes = {
  formData: PropTypes.object,
};
