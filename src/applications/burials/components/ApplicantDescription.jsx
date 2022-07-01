import React from 'react';
import PropTypes from 'prop-types';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const ApplicantDescription = ({ formContext }) => (
  <div>
    <p>
      As the person claiming burial benefits, you need to provide some key
      information. You aren’t required to fill in all fields, but we can review
      your application faster if you provide more information.
    </p>
    <PrefillMessage formContext={formContext} />
  </div>
);

ApplicantDescription.propTypes = {
  formContext: PropTypes.object,
};

export default ApplicantDescription;
