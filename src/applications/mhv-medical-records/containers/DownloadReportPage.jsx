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
import { add, compareAsc } from 'date-fns';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  selectPatientFacilities,
  selectIsCernerPatient,
  selectIsCernerOnlyPatient,
} from '~/platform/user/cerner-dsot/selectors';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';
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
  CernerAlertContent,
  documentTypes,
  pageTitles,
  refreshExtractTypes,
  statsdFrontEndActions,
} from '../util/constants';
import { genAndDownloadCCD, downloadCCDV2 } from '../actions/downloads';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import { Actions } from '../util/actionTypes';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import useAlerts from '../hooks/use-alerts';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { postRecordDatadogAction } from '../api/MrApi';
import CCDAccordionItemV1 from './ccdAccordionItem/ccdAccordionItemV1';
import CCDAccordionItemV2 from './ccdAccordionItem/ccdAccordionItemV2';
import CCDAccordionItemOH from './ccdAccordionItem/ccdAccordionItemOH';
import CCDAccordionItemDual from './ccdAccordionItem/ccdAccordionItemDual';

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

  const ccdExtendedFileTypeFlag = useSelector(
    state => state.featureToggles?.mhv_medical_records_ccd_extended_file_types,
  );

  const [selfEnteredPdfLoading, setSelfEnteredPdfLoading] = useState(false);
  const [successfulSeiDownload, setSuccessfulSeiDownload] = useState(false);
  const [failedSeiDomains, setFailedSeiDomains] = useState([]);
  const [seiPdfGenerationError, setSeiPdfGenerationError] = useState(null);
  const [expandSelfEntered, setExpandSelfEntered] = useState(false);

  const activeAlert = useAlerts(dispatch);
  const selfEnteredAccordionRef = useRef(null);
  const blueButtonFilteringTrackedRef = useRef(false);

  // Determine user's data sources using platform selectors
  const { facilities, hasOHFacilities, hasOHOnly } = useSelector(state => ({
    facilities: selectPatientFacilities(state) || [],
    hasOHFacilities: selectIsCernerPatient(state),
    hasOHOnly: selectIsCernerOnlyPatient(state),
  }));
  // Note: No platform selector exists for "has VistA facilities only"
  const hasVistAFacilities = facilities.length > 0 && !hasOHOnly;
  const hasBothDataSources = hasOHFacilities && hasVistAFacilities;

  // Get Drupal EHR data for facility name mapping
  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData?.vamcEhrData?.data?.ehrDataByVhaId,
  );

  // Map facility IDs to facility names
  const vistaFacilityNames = useMemo(
    () => {
      if (!ehrDataByVhaId) return [];
      const vistaFacilities = facilities.filter(f => !f.isCerner);
      return vistaFacilities
        .map(f => getVamcSystemNameFromVhaId(ehrDataByVhaId, f.facilityId))
        .filter(name => name); // Filter out undefined/null names
    },
    [facilities, ehrDataByVhaId],
  );

  const ohFacilityNames = useMemo(
    () => {
      if (!ehrDataByVhaId) return [];
      const ohFacilities = facilities.filter(f => f.isCerner);
      return ohFacilities
        .map(f => getVamcSystemNameFromVhaId(ehrDataByVhaId, f.facilityId))
        .filter(name => name); // Filter out undefined/null names
    },
    [facilities, ehrDataByVhaId],
  );

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

  // Track when Blue Button section is filtered based on facility types
  useEffect(
    () => {
      // Only track once per page load to prevent duplicate metrics
      if (facilities.length > 0 && !blueButtonFilteringTrackedRef.current) {
        if (hasOHOnly) {
          // User has only Oracle Health facilities - Blue Button hidden entirely
          postRecordDatadogAction(
            statsdFrontEndActions.BLUE_BUTTON_FILTERED_OH_ONLY,
          );
          sendDataDogAction('Blue Button section hidden - Oracle Health only');
          blueButtonFilteringTrackedRef.current = true;
        } else if (hasBothDataSources) {
          // User has both facility types - showing info message
          postRecordDatadogAction(
            statsdFrontEndActions.BLUE_BUTTON_FILTERED_DUAL_FACILITIES,
          );
          sendDataDogAction(
            'Blue Button section filtered - dual facility types',
          );
          blueButtonFilteringTrackedRef.current = true;
        }
      }
    },
    [facilities.length, hasOHOnly, hasBothDataSources],
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
        userProfile?.userFullName?.first || '',
        userProfile?.userFullName?.last || '',
        fileType,
      ),
    );
    postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_CCD);
    sendDataDogAction(`Download Continuity of Care Document ${fileType} link`);
  };

  const handleDownloadCCDV2 = (e, fileType) => {
    e.preventDefault();
    dispatch(
      downloadCCDV2(
        userProfile?.userFullName?.first || '',
        userProfile?.userFullName?.last || '',
        fileType,
      ),
    );
    postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_CCD);
    sendDataDogAction(`Download CCD V2 ${fileType} link`);
  };

  const handleDownloadSelfEnteredPdf = e => {
    e.preventDefault();
    setSelfEnteredPdfLoading(true);
    generateSEIPdf(userProfile, runningUnitTest)
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
      <p>
        Download your VA medical records as a single report (called your VA Blue
        Button® report). Or find other reports to download.
      </p>

      <AcceleratedCernerFacilityAlert {...CernerAlertContent.DOWNLOAD} />

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
      {/* Blue Button section - hidden for Oracle Health-only users */}
      {!hasOHOnly && (
        <>
          {/* Explanatory message for users with both facility types */}
          {hasBothDataSources &&
            vistaFacilityNames.length > 0 &&
            ohFacilityNames.length > 0 && (
              <va-alert
                status="info"
                className="vads-u-margin-y--2"
                data-testid="dual-facilities-blue-button-message"
                visible
                aria-live="polite"
              >
                <p className="vads-u-margin--0">
                  For {vistaFacilityNames.join(', ')}, you can download your
                  data in a Blue Button report.
                </p>
                <p className="vads-u-margin--0 vads-u-margin-top--1">
                  Data for {ohFacilityNames.join(', ')} is not yet available in
                  Blue Button.
                </p>
                <p className="vads-u-margin--0 vads-u-margin-top--1">
                  You can access records for those by downloading a Continuity
                  of Care Document, which is shown above.
                </p>
              </va-alert>
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
        </>
      )}

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
        {(() => {
          if (ccdExtendedFileTypeFlag) {
            if (hasBothDataSources) {
              return (
                <CCDAccordionItemDual
                  generatingCCD={generatingCCD}
                  handleDownloadCCD={handleDownloadCCD}
                  handleDownloadCCDV2={handleDownloadCCDV2}
                  vistaFacilityNames={vistaFacilityNames}
                  ohFacilityNames={ohFacilityNames}
                />
              );
            }
            if (hasOHOnly) {
              return (
                <CCDAccordionItemOH
                  generatingCCD={generatingCCD}
                  handleDownloadCCDV2={handleDownloadCCDV2}
                />
              );
            }
            return (
              <CCDAccordionItemV2
                generatingCCD={generatingCCD}
                handleDownloadCCD={handleDownloadCCD}
              />
            );
          }
          return (
            <CCDAccordionItemV1
              generatingCCD={generatingCCD}
              handleDownloadCCD={handleDownloadCCD}
            />
          );
        })()}
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
            in the previous version of My HealtheVet. You can no longer enter or
            edit health information in My HealtheVet.
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
