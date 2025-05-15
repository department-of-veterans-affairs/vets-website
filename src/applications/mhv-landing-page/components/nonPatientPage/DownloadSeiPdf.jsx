import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateSEIPdf } from '@department-of-veterans-affairs/mhv/exports';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  GET_SEI_PDF,
  GET_SEI_PDF_SUCCESS,
  GET_SEI_PDF_FAILED,
} from '../../reducers/seiPdfReducer';
import { seiLoading } from '../../selectors';

const DownloadSeiPdf = () => {
  const dispatch = useDispatch();
  const {
    user: { profile: userProfile },
  } = useSelector(state => state);
  const useUnifiedSelfEnteredAPI = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsUseUnifiedSeiApi
      ],
  );
  const pdfSeiLoading = useSelector(seiLoading);

  const handleGeneratePdf = e => {
    e.preventDefault();
    dispatch({
      type: GET_SEI_PDF,
    });
    generateSEIPdf(userProfile, useUnifiedSelfEnteredAPI, false)
      .then(response => {
        if (response.success) {
          const { failedDomains } = response;
          dispatch({
            type: GET_SEI_PDF_SUCCESS,
            failedDomains,
          });
        } else {
          dispatch({
            type: GET_SEI_PDF_FAILED,
          });
        }
      })
      .catch(_err => {
        dispatch({
          type: GET_SEI_PDF_FAILED,
        });
      });
  };

  return (
    <div className="vads-u-margin-bottom--2">
      <p className="vads-u-font-size--md vads-u-margin-bottom--0">
        If you entered your own health information in the previous My HealtheVet
        experience, you can still download it for your personal records.
      </p>
      <p className="vads-u-font-size--md">
        You can no longer use My HealtheVet to record personal information.
        Instead, you can share this information with your care team to add to
        your records.
      </p>
      {pdfSeiLoading ? (
        <div id="generating-sei-indicator">
          <va-loading-indicator
            label="Loading"
            message="Preparing your download..."
            data-testid="sei-loading-indicator"
          />
        </div>
      ) : (
        <va-link
          download
          href="#"
          onClick={handleGeneratePdf}
          text="Download self-entered health information report (PDF)"
          data-testid="downloadSelfEnteredButton"
        />
      )}
    </div>
  );
};

export default DownloadSeiPdf;
