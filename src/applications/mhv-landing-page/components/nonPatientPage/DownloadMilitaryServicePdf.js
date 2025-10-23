import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateMilitaryServicePdf } from '@department-of-veterans-affairs/mhv/exports';
import { datadogRum } from '@datadog/browser-rum';
import {
  GET_MILITARY_SERVICE_PDF,
  GET_MILITARY_SERVICE_PDF_SUCCESS,
  GET_MILITARY_SERVICE_PDF_FAILED,
} from '../../reducers/militaryServicePdfReducer';
import { militaryServiceLoading } from '../../selectors';

const DownloadMilitaryServicePdf = () => {
  const dispatch = useDispatch();
  const {
    user: { profile: userProfile },
  } = useSelector(state => state);
  const pdfMilitaryServiceLoading = useSelector(militaryServiceLoading);

  const handleGeneratePdf = e => {
    e.preventDefault();
    dispatch({
      type: GET_MILITARY_SERVICE_PDF,
    });
    generateMilitaryServicePdf(userProfile)
      .then(response => {
        if (response.success) {
          dispatch({
            type: GET_MILITARY_SERVICE_PDF_SUCCESS,
          });
        } else {
          dispatch({
            type: GET_MILITARY_SERVICE_PDF_FAILED,
            error: response.error,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: GET_MILITARY_SERVICE_PDF_FAILED,
          error: error.message,
        });
      });
    datadogRum.addAction(
      'Click on Landing Page: Download DOD military service data',
    );
  };

  return (
    <div className="vads-u-margin-bottom--2">
      <p className="vads-u-font-size--md">
        If you’re a Veteran, you may be able to access your DOD military service
        information via Blue Button.
      </p>
      {pdfMilitaryServiceLoading ? (
        <div id="generating-DoD-indicator">
          <va-loading-indicator
            label="Loading"
            message="Preparing your download..."
            data-testid="DoD-loading-indicator"
          />
        </div>
      ) : (
        <va-link
          download
          href="#"
          onClick={handleGeneratePdf}
          text="Download your DOD military service data (PDF)"
          data-testid="download-DoD-button"
        />
      )}
    </div>
  );
};

export default DownloadMilitaryServicePdf;
