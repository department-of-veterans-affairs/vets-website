import React from 'react';
import PropTypes from 'prop-types';
import {
  ALERT_TYPE_SEI_ERROR,
  MissingRecordsError,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import TrackedSpinner from '../../components/shared/TrackedSpinner';
import {
  accessAlertTypes,
  ALERT_TYPE_CCD_ERROR,
  documentTypes,
} from '../../util/constants';
import AccessTroubleAlertBox from '../../components/shared/AccessTroubleAlertBox';
import DownloadSuccessAlert from '../../components/shared/DownloadSuccessAlert';

const OHOnlyContent = ({
  ccdDownloadSuccess,
  ccdError,
  ccdExtendedFileTypeFlag,
  CCDRetryTimestamp,
  ddSuffix,
  generatingCCD,
  handleDownload,
  testIdSuffix,
  lastSuccessfulUpdate,
  accessErrors,
  activeAlert,
  successfulSeiDownload,
  failedSeiDomains,
}) => {
  return (
    <>
      {generatingCCD ? (
        <div
          id={`generating-ccd-${testIdSuffix}-indicator`}
          data-testid={`generating-ccd-${testIdSuffix}-indicator`}
        >
          <TrackedSpinner
            id={`download-ccd-${testIdSuffix}-spinner`}
            label="Loading"
            message="Preparing your download..."
          />
        </div>
      ) : (
        <div className="vads-u-margin-y--2">
          {lastSuccessfulUpdate && (
            <va-card
              className="vads-u-margin-y--2"
              background
              aria-live="polite"
              data-testid="new-records-last-updated"
            >
              Records in these reports last updated at{' '}
              {lastSuccessfulUpdate.time} on {lastSuccessfulUpdate.date}
            </va-card>
          )}
          {accessErrors()}
          {/* redux action/server errors */}
          {activeAlert?.type === ALERT_TYPE_CCD_ERROR && (
            <AccessTroubleAlertBox
              alertType={accessAlertTypes.DOCUMENT}
              documentType={documentTypes.CCD}
              className="vads-u-margin-bottom--1"
            />
          )}
          {activeAlert?.type === ALERT_TYPE_SEI_ERROR && (
            <AccessTroubleAlertBox
              alertType={accessAlertTypes.DOCUMENT}
              documentType={documentTypes.SEI}
              className="vads-u-margin-bottom--1"
            />
          )}
          {successfulSeiDownload === true &&
            failedSeiDomains.length !== SEI_DOMAINS.length && (
              <>
                <MissingRecordsError
                  documentType="Self-entered health information report"
                  recordTypes={failedSeiDomains}
                />
                <DownloadSuccessAlert
                  type="Self-entered health information report download"
                  className="vads-u-margin-bottom--1"
                />
              </>
            )}
          {ccdDownloadSuccess &&
            !ccdError &&
            !CCDRetryTimestamp && (
              <DownloadSuccessAlert
                type="Continuity of Care Document download"
                className="vads-u-margin-bottom--1"
                focusId="ccd-download-success"
              />
            )}
          <h2>Download your Continuity of Care Document</h2>
          <p>
            This Continuity of Care Document (CCD) is a summary of your VA
            medical records that you can share with non-VA providers in your
            community. It includes your allergies, medications, recent lab
            results, and more. We used to call this report your VA Health
            Summary.
          </p>
          {ccdExtendedFileTypeFlag ? (
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <span className="vads-u-margin-bottom--2">
                <va-link
                  download
                  href="#"
                  onClick={e => handleDownload(e, 'xml')}
                  text="Download XML (best for sharing with your provider)"
                  data-testid={`generateCcdButtonXml${testIdSuffix}`}
                  data-dd-action-name={`Download CCD XML ${ddSuffix}`}
                />
              </span>
              <span className="vads-u-margin-bottom--2">
                <va-link
                  download
                  href="#"
                  onClick={e => handleDownload(e, 'pdf')}
                  text="Download PDF (best for printing)"
                  data-testid={`generateCcdButtonPdf${testIdSuffix}`}
                  data-dd-action-name={`Download CCD PDF ${ddSuffix}`}
                />
              </span>
              <va-link
                download
                href="#"
                onClick={e => handleDownload(e, 'html')}
                text="Download HTML (best for screen readers, enlargers, and refreshable Braille displays)"
                data-testid={`generateCcdButtonHtml${testIdSuffix}`}
                data-dd-action-name={`Download CCD HTML ${ddSuffix}`}
              />
            </div>
          ) : (
            <>
              <p>
                You can download this report in .xml format, a standard file
                format that works with other providers' medical records systems.
              </p>
              <div className="vads-u-display--flex vads-u-flex-direction--column">
                <va-link
                  download
                  href="#"
                  onClick={e => handleDownload(e, 'xml')}
                  text="Download Continuity of Care Document (XML)"
                  data-testid={`generateCcdButtonXml${testIdSuffix}`}
                  data-dd-action-name={`Download CCD XML ${ddSuffix}`}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

OHOnlyContent.propTypes = {
  accessErrors: PropTypes.func.isRequired,
  ccdExtendedFileTypeFlag: PropTypes.bool.isRequired,
  ddSuffix: PropTypes.string.isRequired,
  failedSeiDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  generatingCCD: PropTypes.bool.isRequired,
  handleDownload: PropTypes.func.isRequired,
  successfulSeiDownload: PropTypes.bool.isRequired,
  testIdSuffix: PropTypes.string.isRequired,
  CCDRetryTimestamp: PropTypes.string,
  activeAlert: PropTypes.object,
  ccdDownloadSuccess: PropTypes.bool,
  ccdError: PropTypes.bool,
  lastSuccessfulUpdate: PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.string,
  }),
};

export default OHOnlyContent;
