import React from 'react';
import PropTypes from 'prop-types';

export default function DeathCertificateUploadMessage({ formData }) {
  const isAvailable =
    formData?.burialAllowanceRequested?.service === true ||
    formData?.locationOfDeath?.location !== 'vaMedicalCenter';

  const isConnectedToMedicalCenter = Boolean(
    formData?.burialAllowanceRequested?.service === true &&
      formData?.locationOfDeath?.location === 'vaMedicalCenter'
      ? 0
      : 1,
  );
  return isAvailable && isConnectedToMedicalCenter ? (
    <>
      <p>
        Upload a copy of the Veteran’s death certificate including the cause of
        death.
      </p>
      <p>
        <strong>How to upload files</strong>
      </p>
      <ul>
        <li>Format the file as a .jpg, .pdf, or .png file</li>
        <li>Be sure that your file size is 20mb or less</li>
      </ul>
    </>
  ) : (
    <>
      <p>
        We recommend uploading a copy of the Veteran’s death certificate
        including the cause of death.
      </p>
      <p>
        It’s your choice whether you want to upload a death certificate. It may
        help us determine the burial allowance amount.
      </p>
      <p>
        <strong>How to upload files</strong>
      </p>
      <ul>
        <li>Format the file as a .jpg, .pdf, or .png file</li>
        <li>Be sure that your file size is 20mb or less</li>
      </ul>
    </>
  );
}

DeathCertificateUploadMessage.propTypes = {
  formData: PropTypes.shape({
    burialAllowanceRequested: PropTypes.shape({
      service: PropTypes.bool,
    }),
    locationOfDeath: PropTypes.shape({
      location: PropTypes.string,
    }),
  }),
};
