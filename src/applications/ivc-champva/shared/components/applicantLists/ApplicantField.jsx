import React from 'react';
import PropTypes from 'prop-types';

export default function ApplicantField({ formData }) {
  const { first, middle, last, suffix } = formData.applicantName;

  return (
    <div>
      <strong>
        {first} {middle && `${middle} `}
        {last}
        {suffix && `, ${suffix}`}
      </strong>
    </div>
  );
}

ApplicantField.propTypes = {
  formData: PropTypes.shape({
    applicantName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
  }),
};
