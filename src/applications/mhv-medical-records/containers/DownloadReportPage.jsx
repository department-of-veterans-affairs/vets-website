import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
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
import { getLastSuccessfulUpdate, sendDataDogAction } from '../util/helpers';
import {
  pageTitles,
  refreshExtractTypes,
  statsdFrontEndActions,
  dataSourceTypes,
} from '../util/constants';
import { genAndDownloadCCD, downloadCCDV2 } from '../actions/downloads';
import { Actions } from '../util/actionTypes';
import useAlerts from '../hooks/use-alerts';
import OHOnlyContent from '../components/DownloadRecords/OHOnlyContent';
import VistaOnlyContent from '../components/DownloadRecords/VistaOnlyContent';
import VistaAndOHContent from '../components/DownloadRecords/VistaAndOHContent';
import BlueButtonSection from '../components/DownloadRecords/BlueButtonSection';
import IntroSection from '../components/DownloadRecords/IntroSection';
import { postRecordDatadogAction } from '../api/MrApi';
import { DownloadReportProvider } from '../context/DownloadReportContext';

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
        dispatch({ type: Actions.Downloads.CCD_CLEAR_ALERT });
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

  const handleDownloadCCD = useCallback(
    (e, fileType) => {
      e.preventDefault();
      dispatch(
        genAndDownloadCCD(
          userProfile?.userFullName?.first || '',
          userProfile?.userFullName?.last || '',
          fileType,
        ),
      );
      postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_CCD);
      sendDataDogAction(
        `Download Continuity of Care Document ${fileType} link`,
      );
    },
    [
      dispatch,
      userProfile?.userFullName?.first,
      userProfile?.userFullName?.last,
    ],
  );

  const handleDownloadCCDV2 = useCallback(
    (e, fileType) => {
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
    },
    [
      dispatch,
      userProfile?.userFullName?.first,
      userProfile?.userFullName?.last,
    ],
  );

  // Determine which data source type to use for rendering
  // When ccdOHFlagEnabled is disabled, it defaults to displaying VistA-only content for all users
  const getDataSourceType = () => {
    if (!ccdOHFlagEnabled) return dataSourceTypes.VISTA_ONLY;
    if (hasBothDataSources) return dataSourceTypes.BOTH;
    if (hasOHOnly) return dataSourceTypes.OH_ONLY;
    return dataSourceTypes.VISTA_ONLY;
  };

  const dataSourceType = getDataSourceType();

  // Context value shared with all content components
  const downloadReportContextValue = useMemo(
    () => ({
      // Feature flags
      ccdExtendedFileTypeFlag,
      // CCD state
      generatingCCD,
      ccdError,
      ccdDownloadSuccess,
      CCDRetryTimestamp,
      // Handlers
      handleDownloadCCD,
      handleDownloadCCDV2,
      // Alert state
      activeAlert,
      // Test utilities
      runningUnitTest,
      // Facility data
      vistaFacilityNames,
      ohFacilityNames,
      // Self-entered accordion state (only used by VistaOnlyContent)
      expandSelfEntered,
      selfEnteredAccordionRef,
    }),
    [
      ccdExtendedFileTypeFlag,
      generatingCCD,
      ccdError,
      ccdDownloadSuccess,
      CCDRetryTimestamp,
      handleDownloadCCD,
      handleDownloadCCDV2,
      activeAlert,
      runningUnitTest,
      vistaFacilityNames,
      ohFacilityNames,
      expandSelfEntered,
      selfEnteredAccordionRef,
    ],
  );

  // Render the appropriate content component based on data source type
  const renderContent = () => {
    switch (dataSourceType) {
      case dataSourceTypes.BOTH:
        return <VistaAndOHContent />;
      case dataSourceTypes.OH_ONLY:
        return <OHOnlyContent />;
      default:
        return <VistaOnlyContent />;
    }
  };

  return (
    <DownloadReportProvider value={downloadReportContextValue}>
      <div>
        <IntroSection
          dataSourceType={dataSourceType}
          lastSuccessfulUpdate={lastSuccessfulUpdate}
          ohFacilityNames={ohFacilityNames}
          vistaFacilityNames={vistaFacilityNames}
          showHoldTimeMessaging={holdTimeMessagingUpdate}
        />
        {dataSourceType !== dataSourceTypes.OH_ONLY && (
          <BlueButtonSection
            activeAlert={activeAlert}
            failedBBDomains={failedBBDomains}
            successfulBBDownload={successfulBBDownload}
          />
        )}
        {renderContent()}
        <NeedHelpSection />
      </div>
    </DownloadReportProvider>
  );
};

DownloadReportPage.propTypes = {
  runningUnitTest: PropTypes.bool,
};

export default DownloadReportPage;
