import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  updatePageTitle,
  generateSEIPdf,
  SEI_DOMAINS,
  ALERT_TYPE_SEI_ERROR,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { add, compareAsc } from 'date-fns';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';
import ExternalLink from '../components/shared/ExternalLink';
import {
  getFailedDomainList,
  getLastSuccessfulUpdate,
  sendDataDogAction,
} from '../util/helpers';
import {
  accessAlertTypes,
  ALERT_TYPE_BB_ERROR,
  ALERT_TYPE_CCD_ERROR,
  BB_DOMAIN_DISPLAY_MAP,
  documentTypes,
  pageTitles,
  refreshExtractTypes,
  statsdFrontEndActions,
} from '../util/constants';
import { genAndDownloadCCD } from '../actions/downloads';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import { Actions } from '../util/actionTypes';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { postRecordDatadogAction } from '../api/MrApi';

// --- Main component ---
const DownloadReportPage = ({ runningUnitTest }) => {
  const dispatch = useDispatch();

  const {
    user: { profile: userProfile },
    mr: {
      downloads: {
        generatingCCD,
        ccdDownloadSuccess,
        error: ccdError,
        bbDownloadSuccess: successfulBBDownload,
      },
      blueButton: { failedDomains: failedBBDomains },
      refresh: { status: refreshStatus },
    },
  } = useSelector(state => state);

  const fullState = useSelector(state => state);

  const selectMilestoneTwoFlag = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsMilestoneTwo],
  );

  const ccdExtendedFileTypeFlag = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes
      ],
  );

  const useUnifiedSelfEnteredAPI = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsUseUnifiedSeiApi
      ],
  );

  const [selfEnteredPdfLoading, setSelfEnteredPdfLoading] = useState(false);
  const [successfulSeiDownload, setSuccessfulSeiDownload] = useState(false);
  const [failedSeiDomains, setFailedSeiDomains] = useState([]);
  const [seiPdfGenerationError, setSeiPdfGenerationError] = useState(null);
  const [expandSelfEntered, setExpandSelfEntered] = useState(false);

  const activeAlert = useAlerts(dispatch);
  const selfEnteredAccordionRef = useRef(null);

  // Checks if CCD retry is needed and returns a formatted timestamp or null.
  const CCDRetryTimestamp = useMemo(
    () => {
      const errorTimestamp = localStorage.getItem('lastCCDError');
      if (errorTimestamp !== null) {
        const retryDate = add(new Date(errorTimestamp), { hours: 24 });
        if (compareAsc(retryDate, new Date()) >= 0) {
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short', // Include the time zone abbreviation
          };
          return new Intl.DateTimeFormat('en-US', options).format(retryDate);
        }
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ccdError],
  );

  // Initial page setup effect
  useEffect(
    () => {
      updatePageTitle(pageTitles.DOWNLOAD_PAGE_TITLE);
      const params = new URLSearchParams(window.location.search);
      if (params.get('sei') === 'true') {
        // Expand and focus the self-entered accordion if ?sei=true query param is present
        setExpandSelfEntered(true);
      } else {
        // Focus h1 and set page title
        focusElement(document.querySelector('h1'));
      }
      return () => {
        dispatch({ type: Actions.Downloads.BB_CLEAR_ALERT });
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (expandSelfEntered) {
        setTimeout(() => {
          const accordion = selfEnteredAccordionRef.current;
          const heading = accordion?.shadowRoot?.querySelector('h3');
          if (heading) {
            focusElement(heading);
          }
        }, 400);
      }
    },
    [expandSelfEntered],
  );

  const accessErrors = () => {
    // CCD generation Error
    if (CCDRetryTimestamp) {
      return (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.DOCUMENT}
          documentType={documentTypes.CCD}
          className="vads-u-margin-bottom--1"
        />
      );
    }
    // SEI Access Error: If all SEI domains failed
    if (
      failedSeiDomains.length === SEI_DOMAINS.length ||
      seiPdfGenerationError
    ) {
      return (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.DOCUMENT}
          documentType={documentTypes.SEI}
          className="vads-u-margin-bottom--1"
        />
      );
    }
    return null;
  };

  const lastSuccessfulUpdate = useMemo(
    () => {
      return getLastSuccessfulUpdate(refreshStatus, [
        refreshExtractTypes.ALLERGY,
        refreshExtractTypes.CHEM_HEM,
        refreshExtractTypes.VPR,
      ]);
    },
    [refreshStatus],
  );

  const handleDownloadCCD = (e, fileType) => {
    e.preventDefault();
    dispatch(
      genAndDownloadCCD(
        userProfile?.userFullName?.first,
        userProfile?.userFullName?.last,
        fileType, // 'xml' | 'html' | 'pdf'
      ),
    );
    postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_CCD);
    sendDataDogAction(`Download Continuity of Care Document ${fileType} link`);
  };

  const handleDownloadSelfEnteredPdf = e => {
    e.preventDefault();
    setSelfEnteredPdfLoading(true);
    generateSEIPdf(userProfile, useUnifiedSelfEnteredAPI, runningUnitTest)
      .then(res => {
        if (res.success) {
          const { failedDomains } = res;
          setFailedSeiDomains(failedDomains);
          setSuccessfulSeiDownload(true);
          setSelfEnteredPdfLoading(false);
        } else {
          setSeiPdfGenerationError(true);
          setSelfEnteredPdfLoading(false);
        }
      })
      .catch(err => {
        setSeiPdfGenerationError(err);
        setSelfEnteredPdfLoading(false);
      });
    postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_SEI);
    sendDataDogAction('Download self-entered health information PDF link');
  };

  return (
    <div>
      <h1>Download your medical records reports</h1>
      <p className="vads-u-margin--0">
        Download your VA medical records as a single report (called your VA Blue
        Button® report). Or find other reports to download.
      </p>
      {lastSuccessfulUpdate && (
        <va-card
          class="vads-u-margin-y--2"
          background
          aria-live="polite"
          data-testid="new-records-last-updated"
        >
          Records in these reports last updated at {lastSuccessfulUpdate.time}{' '}
          on {lastSuccessfulUpdate.date}
        </va-card>
      )}
      <h2>Download your VA Blue Button report</h2>
      {activeAlert?.type === ALERT_TYPE_BB_ERROR && (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.DOCUMENT}
          documentType={documentTypes.BB}
          className="vads-u-margin-bottom--1"
        />
      )}
      {successfulBBDownload === true && (
        <>
          <MissingRecordsError
            documentType="VA Blue Button report"
            recordTypes={getFailedDomainList(
              failedBBDomains,
              BB_DOMAIN_DISPLAY_MAP,
            )}
          />
          <DownloadSuccessAlert
            type="Your VA Blue Button report download has"
            className="vads-u-margin-bottom--1"
          />
        </>
      )}
      <p className="vads-u-margin--0 vads-u-margin-top--3 vads-u-margin-bottom--1">
        First, select the types of records you want in your report. Then
        download.
      </p>
      <va-link-action
        href="/my-health/medical-records/download/date-range"
        label="Select records and download report"
        text="Select records and download report"
        data-dd-action-name="Select records and download"
        onClick={() => sendDataDogAction('Select records and download')}
        data-testid="go-to-download-all"
      />

      <h2>Other reports you can download</h2>

      {(generatingCCD || ccdDownloadSuccess) &&
        (!ccdError && !CCDRetryTimestamp) && (
          <DownloadSuccessAlert
            type="Continuity of Care Document download"
            className="vads-u-margin-bottom--1"
            focusId="ccd-download-success"
          />
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
      <va-accordion bordered>
        <va-accordion-item bordered data-testid="ccdAccordionItem">
          <h3 slot="headline">
            Continuity of Care Document (VA Health Summary)
          </h3>
          <p className="vads-u-margin--0">
            This Continuity of Care Document (CCD) is a summary of your VA
            medical records that you can share with non-VA providers in your
            community. It includes your allergies, medications, recent lab
            results, and more.
          </p>
          <p>
            You can download this report in .xml format, a standard file format
            that works with other providers’ medical records systems.
          </p>
          {generatingCCD ? (
            <div id="generating-ccd-indicator">
              <TrackedSpinner
                id="download-ccd-spinner"
                label="Loading"
                message="Preparing your download..."
              />
            </div>
          ) : (
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <va-link
                download
                href="#"
                onClick={e => handleDownloadCCD(e, 'xml')}
                text="Download Continuity of Care Document (XML)"
                data-testid="generateCcdButtonXml"
                data-dd-action-name="Download CCD XML"
              />
              {ccdExtendedFileTypeFlag && (
                <>
                  <va-link
                    download
                    href="#"
                    onClick={e => handleDownloadCCD(e, 'pdf')}
                    text="Download Continuity of Care Document (PDF)"
                    data-testid="generateCcdButtonPdf"
                    data-dd-action-name="Download CCD PDF"
                    class="vads-u-margin-top--1"
                  />
                  <va-link
                    download
                    href="#"
                    onClick={e => handleDownloadCCD(e, 'html')}
                    text="Download Continuity of Care Document (HTML)"
                    data-testid="generateCcdButtonHtml"
                    data-dd-action-name="Download CCD HTML"
                    class="vads-u-margin-top--1"
                  />
                </>
              )}
            </div>
          )}
        </va-accordion-item>
        <va-accordion-item
          bordered
          data-testid="selfEnteredAccordionItem"
          open={expandSelfEntered ? 'true' : undefined}
          ref={selfEnteredAccordionRef}
        >
          <h3 id="self-entered-header" slot="headline" tabIndex="-1">
            Self-entered health information
          </h3>
          <p className="vads-u-margin--0">
            This report includes all the health information you entered yourself
            in the previous version of My HealtheVet.
            {selectMilestoneTwoFlag &&
              ` You can no longer enter or
            edit health information in My HealtheVet.`}
          </p>
          <p>
            Your VA health care team can’t access this self-entered information
            directly. If you want to share this information with your care team,
            print this report and bring it to your next appointment.
          </p>
          {selfEnteredPdfLoading ? (
            <div id="generating-sei-indicator">
              <TrackedSpinner
                id="download-self-entered-spinner"
                label="Loading"
                message="Preparing your download..."
                data-testid="sei-loading-indicator"
              />
            </div>
          ) : (
            <va-link
              download
              href="#"
              onClick={handleDownloadSelfEnteredPdf}
              text="Download self-entered health information report (PDF)"
              data-testid="downloadSelfEnteredButton"
            />
          )}
          {!selectMilestoneTwoFlag && (
            <>
              <p>
                <strong>Note:</strong> Self-entered My Goals are no longer
                available on My HealtheVet and not included in this report. To
                download your historical goals you can go to the previous
                version of My HealtheVet.
              </p>
              <ExternalLink
                href={mhvUrl(
                  isAuthenticatedWithSSOe(fullState),
                  'va-blue-button',
                )}
                text="Go to the previous version of My HealtheVet to download historical
                goals"
              />
            </>
          )}
        </va-accordion-item>
      </va-accordion>
      <p className="vads-u-margin--0 vads-u-margin-top--2">
        <strong>Note:</strong> Blue Button and the Blue Button logo are
        registered service marks owned by the U.S. Department of Health and
        Human Services.
      </p>
      <NeedHelpSection />
    </div>
  );
};

DownloadReportPage.propTypes = {
  runningUnitTest: PropTypes.bool,
};

export default DownloadReportPage;
