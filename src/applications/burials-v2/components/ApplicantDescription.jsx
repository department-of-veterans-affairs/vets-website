import React from 'react';
import PropTypes from 'prop-types';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const ApplicantDescription = ({ formContext }) => (
  <div>
    <p>
      As the person claiming burial benefits, you’ll need to provide some
      information. You don’t need to fill in all the fields, but we can review
      your application faster if you provide more information.
    </p>
    <PrefillMessage formContext={formContext} />
  </div>
);

ApplicantDescription.propTypes = {
  formContext: PropTypes.object,
};

export default ApplicantDescription;
