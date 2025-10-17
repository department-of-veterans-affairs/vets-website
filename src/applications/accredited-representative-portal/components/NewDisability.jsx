import React from 'react';
import PropTypes from 'prop-types';

const NULL_CONDITION_STRING = 'Unknown Condition';

export default function NewDisability({ formData }) {
  return (
    <div className="vads-u-margin-left--1 vads-u-padding-right--2 word-break capitalize-first-letter">
      {typeof formData?.condition === 'string'
        ? formData.condition
        : NULL_CONDITION_STRING}
    </div>
  );
}

NewDisability.propTypes = {
  formData: PropTypes.object.isRequired,
};
