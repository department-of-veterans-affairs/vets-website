import React from 'react';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const OutsideVAAuthorizationNameDescription = ({ formData }) => {
  return (
    <>
      <h3>Authorization for access outside of VA’s systems</h3>
      <p className="appoint-text">
        You’ve authorized this accredited{' '}
        {getRepType(formData['view:selectedRepresentative'])}
        ’s team to access your records outside of VA’s information technology
        systems.
      </p>
    </>
  );
};

OutsideVAAuthorizationNameDescription.propTypes = {
  formData: PropTypes.object,
};

export { OutsideVAAuthorizationNameDescription };
