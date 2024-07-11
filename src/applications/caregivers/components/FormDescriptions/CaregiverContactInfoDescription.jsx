import React from 'react';
import PropTypes from 'prop-types';

const CaregiverContactInfoDescription = ({ label }) => (
  <>
    <p>
      We’ll use the {label} primary phone number to contact them if we need to
      follow up about this application.
    </p>
    <p>
      Providing the caregiver’s email address is optional, but it helps us
      contact them faster.
    </p>
    <p>
      <strong>Note:</strong> We’ll always mail the caregiver a copy of our
      decision on this application for their records.
    </p>
  </>
);

CaregiverContactInfoDescription.propTypes = {
  label: PropTypes.string,
};

export default CaregiverContactInfoDescription;
