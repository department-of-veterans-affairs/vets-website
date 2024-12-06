import React from 'react';
import PropTypes from 'prop-types';
import { getRepType } from '../utilities/helpers';

const MedicalAuthorizationDescription = ({ formData }) => {
  return (
    <>
      <h3>Authorization to access certain medical records</h3>
      <p className="appoint-text">
        This accredited {getRepType(formData['view:selectedRepresentative'])}{' '}
        may need to access certain medical records to help you. You can
        authorize them to access all or some of these types of records:
      </p>
      <ul className="appoint-text">
        <li>Alcoholism and alcohol abuse records</li>
        <li>Drug abuse records</li>
        <li>HIV (human immunodeficiency virus) records</li>
        <li>Sickle cell anemia records</li>
      </ul>
    </>
  );
};

MedicalAuthorizationDescription.propTypes = {
  formData: PropTypes.object,
};

export { MedicalAuthorizationDescription };
