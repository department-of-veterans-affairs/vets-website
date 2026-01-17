import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  updatePageTitle,
  generateSEIPdf,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import { add, compareAsc } from 'date-fns';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  selectPatientFacilities,
  selectIsCernerPatient,
  selectIsCernerOnlyPatient,
} from '~/platform/user/cerner-dsot/selectors';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectHoldTimeMessagingUpdate } from '../util/selectors';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';
import {
  getFailedDomainList,
  getLastSuccessfulUpdate,
  sendDataDogAction,
} from '../util/helpers';
import {
  accessAlertTypes,
  documentTypes,
  pageTitles,
  refreshExtractTypes,
  statsdFrontEndActions,
} from '../util/constants';
import { genAndDownloadCCD, downloadCCDV2 } from '../actions/downloads';
import { Actions } from '../util/actionTypes';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import OHOnlyContent from './ccdContent/OHOnlyContent';
import VistaOnlyContent from './ccdContent/VistaOnlyContent';
import VistaAndOHContent from './ccdContent/VistaAndOHContent';
import { postRecordDatadogAction } from '../api/MrApi';
import OHOnlyIntroText from './ccdContent/OHOnlyIntroText';
import VistaIntroText from './ccdContent/VistaIntroText';
import VistaAndOHIntroText from './ccdContent/VistaAndOHIntroText';

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

  const { ccdExtendedFileTypeFlag, ccdOHFlagEnabled } = useSelector(state => ({
    ccdExtendedFileTypeFlag:
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdExtendedFileTypes
      ],
    ccdOHFlagEnabled:
      state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsCcdOH],
  }));
  const holdTimeMessagingUpdate = useSelector(selectHoldTimeMessagingUpdate);

  const [selfEnteredPdfLoading, setSelfEnteredPdfLoading] = useState(false);
  const [successfulSeiDownload, setSuccessfulSeiDownload] = useState(false);
  const [failedSeiDomains, setFailedSeiDomains] = useState([]);
  const [seiPdfGenerationError, setSeiPdfGenerationError] = useState(null);
  const [expandSelfEntered, setExpandSelfEntered] = useState(false);

  const activeAlert = useAlerts(dispatch);
  const selfEnteredAccordionRef = useRef(null);

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

  // Map facility IDs to facility names, fallback to 'None recorded' if empty
  const vistaFacilityNames = useMemo(
    () => {
      if (!ehrDataByVhaId) return ['None recorded'];
      const vistaFacilities = facilities.filter(f => !f.isCerner);
      const names = vistaFacilities
        .map(f => getVamcSystemNameFromVhaId(ehrDataByVhaId, f.facilityId))
        .filter(name => name); // Filter out undefined/null names
      return names.length ? names : ['None recorded'];
    },
    [facilities, ehrDataByVhaId],
  );

  const ohFacilityNames = useMemo(
    () => {
      if (!ehrDataByVhaId) return ['None recorded'];
      const ohFacilities = facilities.filter(f => f.isCerner);
      const names = ohFacilities
        .map(f => getVamcSystemNameFromVhaId(ehrDataByVhaId, f.facilityId))
        .filter(name => name); // Filter out undefined/null names
      return names.length ? names : ['None recorded'];
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

  if (ccdOHFlagEnabled) {
    if (hasBothDataSources) {
      return (
        <div>
          <VistaAndOHIntroText
            ohFacilityNames={ohFacilityNames}
            vistaFacilityNames={vistaFacilityNames}
            holdTimeMessagingUpdate={holdTimeMessagingUpdate}
          />
          <VistaAndOHContent
            vistaFacilityNames={vistaFacilityNames}
            ohFacilityNames={ohFacilityNames}
            handleDownloadCCDV2={handleDownloadCCDV2}
            ccdExtendedFileTypeFlag={ccdExtendedFileTypeFlag}
            failedSeiDomains={failedSeiDomains}
            getFailedDomainList={getFailedDomainList}
            lastSuccessfulUpdate={lastSuccessfulUpdate}
            generatingCCD={generatingCCD}
            handleDownloadCCD={handleDownloadCCD}
            handleDownloadSelfEnteredPdf={handleDownloadSelfEnteredPdf}
            selfEnteredPdfLoading={selfEnteredPdfLoading}
            successfulSeiDownload={successfulSeiDownload}
            activeAlert={activeAlert}
            accessErrors={accessErrors}
            ccdError={ccdError}
            ccdDownloadSuccess={ccdDownloadSuccess}
            CCDRetryTimestamp={CCDRetryTimestamp}
            failedBBDomains={failedBBDomains}
            successfulBBDownload={successfulBBDownload}
          />
          <NeedHelpSection />
        </div>
      );
    }
    if (hasOHOnly) {
      return (
        <div>
          <OHOnlyIntroText holdTimeMessagingUpdate={holdTimeMessagingUpdate} />
          <OHOnlyContent
            testIdSuffix="OH"
            ddSuffix="OH"
            generatingCCD={generatingCCD}
            handleDownload={handleDownloadCCDV2}
            ccdExtendedFileTypeFlag={ccdExtendedFileTypeFlag}
            lastSuccessfulUpdate={lastSuccessfulUpdate}
            accessErrors={accessErrors}
            activeAlert={activeAlert}
            successfulSeiDownload={successfulSeiDownload}
            failedSeiDomains={failedSeiDomains}
            ccdDownloadSuccess={ccdDownloadSuccess}
            ccdError={ccdError}
            CCDRetryTimestamp={CCDRetryTimestamp}
          />

          <NeedHelpSection />
        </div>
      );
    }
  }

  // Default case: OH CCD is disabled, *OR* user has only VistA facilities
  return (
    <div>
      <VistaIntroText holdTimeMessagingUpdate={holdTimeMessagingUpdate} />
      <VistaOnlyContent
        ccdExtendedFileTypeFlag={ccdExtendedFileTypeFlag}
        failedSeiDomains={failedSeiDomains}
        getFailedDomainList={getFailedDomainList}
        lastSuccessfulUpdate={lastSuccessfulUpdate}
        generatingCCD={generatingCCD}
        handleDownloadCCD={handleDownloadCCD}
        expandSelfEntered={expandSelfEntered}
        selfEnteredAccordionRef={selfEnteredAccordionRef}
        selfEnteredPdfLoading={selfEnteredPdfLoading}
        handleDownloadSelfEnteredPdf={handleDownloadSelfEnteredPdf}
        successfulSeiDownload={successfulSeiDownload}
        activeAlert={activeAlert}
        accessErrors={accessErrors}
        ccdError={ccdError}
        ccdDownloadSuccess={ccdDownloadSuccess || false}
        CCDRetryTimestamp={CCDRetryTimestamp}
        failedBBDomains={failedBBDomains}
        successfulBBDownload={successfulBBDownload || false}
      />
      <NeedHelpSection />
    </div>
  );
};

DownloadReportPage.propTypes = {
  runningUnitTest: PropTypes.bool,
};

export default DownloadReportPage;
