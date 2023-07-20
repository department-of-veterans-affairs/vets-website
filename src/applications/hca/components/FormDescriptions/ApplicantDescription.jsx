import React from 'react';
import PropTypes from 'prop-types';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const ApplicantDescription = ({ formContext }) => (
  <>
    <p className="hca-applicant-description">
      You don’t have to fill in all these fields. But we can review your
      application faster if you provide more information.
    </p>
    <PrefillMessage formContext={formContext} />
  </>
);

ApplicantDescription.propTypes = {
  formContext: PropTypes.object,
};

export default ApplicantDescription;
