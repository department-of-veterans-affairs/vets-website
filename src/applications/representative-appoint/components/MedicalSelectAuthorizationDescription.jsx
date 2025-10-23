import React from 'react';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const MedicalSelectAuthorizationDescription = ({ formData }) => {
  return (
    <>
      <h3>Authorization to access certain medical records</h3>
      <p className="vads-u-margin-bottom--3 appoint-text">
        You’ve authorized this accredited{' '}
        {getRepType(formData['view:selectedRepresentative'])} to access some of
        your medical records.
      </p>
    </>
  );
};

MedicalSelectAuthorizationDescription.propTypes = {
  formData: PropTypes.object,
};

export { MedicalSelectAuthorizationDescription };
