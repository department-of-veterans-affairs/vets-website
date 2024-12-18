import React from 'react';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const InsideVAAuthorizationDescription = ({ formData }) => {
  return (
    <>
      <h3>Authorization for access through VA’s systems</h3>
      <p className="appoint-text">
        This accredited {getRepType(formData['view:selectedRepresentative'])}{' '}
        may work with their team to help you file a claim or request a decision
        review. Some of their team members may need to access your records
        through VA’s information technology systems.
      </p>
    </>
  );
};

InsideVAAuthorizationDescription.propTypes = {
  formData: PropTypes.object,
};

export { InsideVAAuthorizationDescription };
