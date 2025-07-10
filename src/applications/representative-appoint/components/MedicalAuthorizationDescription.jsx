import React from 'react';
import PropTypes from 'prop-types';

const MedicalAuthorizationDescription = () => {
  return (
    <>
      <h3>Authorization to access certain medical records</h3>
      <p className="appoint-text">This accredited ....</p>
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
