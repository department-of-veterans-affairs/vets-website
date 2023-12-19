import React from 'react';
import PropTypes from 'prop-types';

export default function SpouseMarriageView({ formData }) {
  return (
    <h3 className="vads-u-font-size--h5 vads-u-margin-y--1">
      {formData.spouseFullName.first} {formData.spouseFullName.last}
    </h3>
  );
}

SpouseMarriageView.propTypes = {
  formData: PropTypes.object,
};
