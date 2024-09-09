import React from 'react';
import PropTypes from 'prop-types';

export default function DeathCertificateUploadMessage({ form }) {
  const isAvailable =
    form?.burialAllowanceRequested?.service === true ||
    form?.locationOfDeath?.location !== 'vaMedicalCenter';

  const isConnectedToMedicalCenter = Boolean(
    form?.burialAllowanceRequested?.service === true &&
    form?.locationOfDeath?.location === 'vaMedicalCenter'
      ? 0
      : 1,
  );
  return isAvailable && isConnectedToMedicalCenter ? (
    <>
      <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        Upload a copy of the Veteran’s death certificate including the cause of
        death.
      </p>
      <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        <strong>How to upload files</strong>
      </p>
      <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        <li>Format the file as a .jpg, .pdf, or .png file</li>
        <li>Be sure that your file size is 20mb or less</li>
      </ul>
    </>
  ) : (
    <>
      <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        We recommend uploading a copy of the Veteran’s death certificate
        including the cause of death.
      </p>
      <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        It’s your choice whether you want to upload a death certificate. It may
        help us determine the burial allowance amount.
      </p>
      <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        <strong>How to upload files</strong>
      </p>
      <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
        <li>Format the file as a .jpg, .pdf, or .png file</li>
        <li>Be sure that your file size is 20mb or less</li>
      </ul>
    </>
  );
}

DeathCertificateUploadMessage.propTypes = {
  form: PropTypes.shape({
    burialAllowanceRequested: PropTypes.shape({
      service: PropTypes.bool,
    }),
    locationOfDeath: PropTypes.shape({
      location: PropTypes.string,
    }),
  }),
};
