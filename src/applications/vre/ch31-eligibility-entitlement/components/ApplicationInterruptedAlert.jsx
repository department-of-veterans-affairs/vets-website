import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { downloadCh31PdfLetter } from '../actions/ch31-my-eligibility-and-benefits';

const ApplicationInterruptedAlert = ({ interruptedReason, resCaseId }) => {
  const dispatch = useDispatch();
  const { loading: isDownloading, error: downloadError } = useSelector(
    state => state?.ch31PdfLetterDownload || {},
  );

  const handleDownload = event => {
    event.preventDefault();

    if (isDownloading) return;

    dispatch(downloadCh31PdfLetter(resCaseId));
  };

  const downloadErrorMessage = downloadError
    ? "We can't download your letter right now. Please try again later."
    : null;

  return (
    <div className="vads-u-margin-y--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">
          Sorry, your VR&E Chapter 31 benefits have been interrupted
        </h3>
        <p>
          Your VR&E Chapter 31 benefits have been interrupted for the following
          reasons:
        </p>
        <p>{interruptedReason || 'No reason provided.'}</p>
        <p>If you need more information, please contact your counselor.</p>
        {isDownloading ? (
          <va-loading-indicator
            label="Loading"
            message="Downloading your letter..."
          />
        ) : (
          <va-link-action
            href="#"
            text="View my letter"
            type="primary"
            onClick={handleDownload}
          />
        )}
        {downloadErrorMessage && <p>{downloadErrorMessage}</p>}
      </va-alert>
    </div>
  );
};

ApplicationInterruptedAlert.propTypes = {
  interruptedReason: PropTypes.string,
  resCaseId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ApplicationInterruptedAlert;
