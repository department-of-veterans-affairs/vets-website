import React from 'react';
import PropTypes from 'prop-types';

export default function SpouseMarriageView({ formData }) {
  return (
    <div>
      <strong>
        {formData.spouseFullName.first} {formData.spouseFullName.last}
      </strong>
    </div>
  );
}

SpouseMarriageView.propTypes = {
  formData: PropTypes.object,
};
