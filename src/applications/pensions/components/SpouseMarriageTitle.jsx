import React from 'react';
import PropTypes from 'prop-types';

import get from '@department-of-veterans-affairs/platform-forms-system/get';

export default function SpouseMarriageTitle({ id, formData }) {
  const title =
    get(['spouseMarriages', 'length'], formData) > 1
      ? 'Spouse’s former marriages'
      : 'Spouse’s former marriage';

  return (
    <legend className="schemaform-block-title" id={id}>
      {title}
    </legend>
  );
}

SpouseMarriageTitle.propTypes = {
  formData: PropTypes.object,
  id: PropTypes.string,
};
