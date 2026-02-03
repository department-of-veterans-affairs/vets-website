import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom-v5-compat';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import useAcceleratedData from '~/platform/mhv/hooks/useAcceleratedData';
import {
  updatePageTitle,
  usePrintTitle,
  MhvPageNotFoundContent,
  pharmacyPhoneNumber,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintOnlyPage from './PrintOnlyPage';
import {
  getErrorTypeFromFormat,
  getRefillHistory,
  hasCmopNdcNumber,
  dateFormat,
} from '../util/helpers';
import PrintDownload from '../components/shared/PrintDownload';
import NonVaPrescription from '../components/PrescriptionDetails/NonVaPrescription';
import VaPrescription from '../components/PrescriptionDetails/VaPrescription';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import { getFilterOptions } from '../util/helpers/getRxStatus';
import {
  rxListSortingOptions,
  defaultSelectedSortOption,
  recordNotFoundMessage,
  DATETIME_FORMATS,
  RX_SOURCE,
  STATION_NUMBER_PARAM,
} from '../util/constants';
import PrescriptionPrintOnly from '../components/PrescriptionDetails/PrescriptionPrintOnly';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import { pageType } from '../util/dataDogConstants';
import { useGetAllergiesQuery } from '../api/allergiesApi';
import { usePrescriptionData } from '../hooks/usePrescriptionData';
import { usePrefetch } from '../api/prescriptionsApi';
import { selectUserDob, selectUserFullName } from '../selectors/selectUser';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../util/selectors';
import {
  selectSortOption,
  selectFilterOption,
  selectPageNumber,
} from '../selectors/selectPreferences';
import useRxDetailExport from '../hooks/useRxDetailExport';

const PrescriptionDetails = () => {
  const { prescriptionId } = useParams();
  const [searchParams] = useSearchParams();
  const stationNumber = searchParams.get(STATION_NUMBER_PARAM);
  const navigate = useNavigate();

  // Get sort/filter selections from store.
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);
  const currentPage = useSelector(selectPageNumber);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);

  // Redirect to medications list if v2 API is enabled but station_number is missing
  // This handles edge cases like old bookmarks or direct URL access without station_number
  useEffect(
    () => {
      if (isCernerPilot && !stationNumber) {
        navigate('/my-health/medications', { replace: true });
      }
    },
    [isCernerPilot, stationNumber, navigate],
  );

  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );
  // Consolidate query parameters into a single state object to avoid multiple re-renders
  const [queryParams] = useState({
    page: currentPage || 1,
    perPage: 10,
    sortEndpoint:
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: currentFilterOptions[selectedFilterOption]?.url || '',
  });

  // Use the custom hook to fetch prescription data
  const { prescription, prescriptionApiError, isLoading } = usePrescriptionData(
    prescriptionId,
    queryParams,
  );

  const nonVaPrescription =
    prescription?.prescriptionSource === RX_SOURCE.NON_VA;

  const userName = useSelector(selectUserFullName);
  const dob = useSelector(selectUserDob);
  const {
    isAcceleratingAllergies,
    isCerner,
    isLoading: isAcceleratedDataLoading,
  } = useAcceleratedData();

  const { data: allergies, error: allergiesError } = useGetAllergiesQuery(
    {
      isAcceleratingAllergies,
      isCerner,
    },
    {
      skip: isAcceleratedDataLoading, // Wait for Cerner data and toggles to load before calling API
    },
  );

  // Initialize export hook
  const {
    onDownload: handleFileDownload,
    isLoading: isExportLoading,
    isSuccess: isExportSuccess,
    hasError: hasExportError,
    errorFormat,
  } = useRxDetailExport({
    user: { ...userName, dob },
    prescription,
    allergies,
    allergiesError,
    isNonVaPrescription: nonVaPrescription,
    features: { isCernerPilot, isV2StatusMapping },
  });

  const prescriptionHeader =
    prescription?.prescriptionName || prescription?.orderableItem;
  const refillHistory = useMemo(() => getRefillHistory(prescription), [
    prescription,
  ]);

  // Prefetch prescription documentation for faster loading when
  // going to the documentation page
  const prefetchPrescriptionDocumentation = usePrefetch(
    'getPrescriptionDocumentation',
  );

  const hasPrefetched = useRef(false);

  useEffect(
    () => {
      if (
        !isLoading &&
        !hasPrefetched.current &&
        hasCmopNdcNumber(refillHistory)
      ) {
        prefetchPrescriptionDocumentation({
          id: prescriptionId,
          stationNumber: stationNumber || prescription?.stationNumber,
        });
        hasPrefetched.current = true;
      }
    },
    [
      isLoading,
      prescriptionId,
      stationNumber,
      prescription,
      refillHistory,
      prefetchPrescriptionDocumentation,
    ],
  );

  useEffect(
    () => {
      if (prescription) {
        focusElement(document.querySelector('h1'));
        updatePageTitle('Medications details | Veterans Affairs');
      } else {
        window.scrollTo(0, 0);
      }
    },
    [prescription],
  );

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, updatePageTitle);

  const filledEnteredDate = () => {
    if (nonVaPrescription) {
      return (
        <>
          Documented on{' '}
          {dateFormat(
            prescription?.orderedDate,
            DATETIME_FORMATS.longMonthDate,
          )}
        </>
      );
    }
    if (prescription?.sortedDispensedDate) {
      return (
        <span>
          Last filled on{' '}
          {dateFormat(
            prescription.sortedDispensedDate,
            DATETIME_FORMATS.longMonthDate,
          )}
        </span>
      );
    }
    if (!isCernerPilot) {
      return <span>Not filled yet</span>;
    }
    return null;
  };

  // Determine if we should show the last filled paragraph
  const showLastFilledParagraph =
    nonVaPrescription || prescription?.sortedDispensedDate || !isCernerPilot;

  const hasPrintError =
    prescription && !prescriptionApiError && !allergiesError;

  const pendingMedAlert = () => {
    const { orderedDate } = prescription;
    const { pendingMed } = prescription;
    const orderedMoreThanSevenDaysAgo = () => {
      const today = new Date();
      const eightDaysLater = new Date(orderedDate);
      eightDaysLater.setDate(eightDaysLater.getDate() + 8);

      return today > eightDaysLater;
    };
    return (
      <>
        <va-alert
          visible={pendingMed}
          id="pending-med"
          status={`${orderedMoreThanSevenDaysAgo() ? 'warning' : 'info'}`}
          setFocus
          uswds
          class={
            pendingMed
              ? 'vads-u-margin-y--1 vads-u-margin-bottom--3'
              : 'vads-u-margin-bottom--3'
          }
        >
          <h2
            className="vads-u-margin-y--0 vads-u-font-size--h3"
            data-testid="pending-med-alert"
          >
            {orderedMoreThanSevenDaysAgo()
              ? 'Your VA pharmacy is still reviewing this prescription'
              : 'Your VA pharmacy is reviewing this prescription'}
          </h2>
          <p>
            {orderedMoreThanSevenDaysAgo()
              ? 'This pharmacy review is taking longer than expected.'
              : 'It may take 24-72 hours to review. And the prescription details may change. Check back for updates.'}
          </p>
          <p>
            If you need this prescription now, call your VA pharmacy
            {pharmacyPhoneNumber(prescription) && (
              <>
                {' '}
                at{' '}
                <va-telephone
                  contact={pharmacyPhoneNumber(prescription)}
                  not-clickable
                />{' '}
                (<va-telephone tty contact="711" not-clickable />)
              </>
            )}
            .
          </p>
        </va-alert>
      </>
    );
  };

  const content = () => {
    if (isLoading) {
      return (
        <va-loading-indicator
          message="Loading your medication record..."
          setFocus
          data-testid="loading-indicator"
        />
      );
    }

    if (prescriptionApiError.message === recordNotFoundMessage) {
      return <MhvPageNotFoundContent />;
    }

    if (prescription || prescriptionApiError) {
      return (
        <div>
          <div className="no-print">
            <h1
              aria-describedby="last-filled"
              data-testid="prescription-name"
              className="vads-u-margin-bottom--0 wrap-text"
              id="prescription-name"
              data-dd-privacy="mask"
            >
              {prescriptionHeader}
            </h1>
            {prescriptionApiError ? (
              <ApiErrorNotification errorType="access" content="medications" />
            ) : (
              <>
                {showLastFilledParagraph && (
                  <p
                    id="last-filled"
                    className={`title-last-filled-on vads-u-font-family--sans vads-u-margin-top--2 medium-screen: vads-u-margin-bottom--2 ${
                      nonVaPrescription ? 'vads-u-margin-bottom--2' : ''
                    }`}
                    data-testid="rx-last-filled-date"
                  >
                    {filledEnteredDate()}
                  </p>
                )}
                {prescription.prescriptionSource ===
                  RX_SOURCE.PENDING_DISPENSE && pendingMedAlert()}
                {hasExportError && (
                  <ApiErrorNotification
                    errorType={getErrorTypeFromFormat(errorFormat)}
                    content="records"
                  >
                    <p>
                      If it still doesn’t work, call us at{' '}
                      <va-telephone contact="8773270022" /> (
                      <va-telephone contact={CONTACTS[711]} tty />
                      ). We’re here Monday through Friday, 8:00 a.m. to 8:00
                      p.m. ET.
                    </p>
                  </ApiErrorNotification>
                )}
                <>
                  {nonVaPrescription ? (
                    <NonVaPrescription {...prescription} />
                  ) : (
                    <VaPrescription {...prescription} />
                  )}
                </>

                <div className="no-print vads-u-margin-top--3 vads-u-margin-bottom--5">
                  <>
                    <div className="vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-y--3 medium-screen:vads-u-margin-y--4" />
                    <BeforeYouDownloadDropdown page={pageType.DETAILS} />
                  </>

                  <PrintDownload
                    onDownload={handleFileDownload}
                    isSuccess={isExportSuccess}
                    isLoading={isExportLoading}
                  />
                </div>
              </>
            )}
          </div>
          <PrintOnlyPage
            title="Medication details"
            hasError={!hasPrintError}
            preface={
              hasPrintError
                ? 'This is a single medication record from your VA medical records. When you download a medication record, we also include a list of allergies and reactions in your VA medical records.'
                : undefined
            }
          >
            <PrescriptionPrintOnly
              rx={prescription}
              refillHistory={!nonVaPrescription ? refillHistory : []}
              isDetailsRx
            />
            <AllergiesPrintOnly allergies={allergies} />
          </PrintOnlyPage>
        </div>
      );
    }

    return null;
  };

  return <div>{content()}</div>;
};

export default PrescriptionDetails;
