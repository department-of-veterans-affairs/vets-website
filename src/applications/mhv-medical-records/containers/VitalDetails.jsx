import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  generatePdfScaffold,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
  getNameDateAndTime,
  makePdf,
  formatNameFirstLast,
  formatUserDob,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  clearVitalDetails,
  getVitalDetails,
  getVitals,
  reloadRecords,
  setVitalsList,
} from '../actions/vitals';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import {
  macroCase,
  generateTextFile,
  getLastUpdatedText,
  formatDateInLocalTimezone,
  sendDataDogAction,
} from '../util/helpers';
import {
  vitalTypeDisplayNames,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
  loadStates as LOAD_STATES,
  statsdFrontEndActions,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateVitalContent,
  generateVitalsIntro,
} from '../util/pdfHelpers/vitals';

import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import useListRefresh from '../hooks/useListRefresh';
import HeaderSection from '../components/shared/HeaderSection';
import LabelValue from '../components/shared/LabelValue';

import { useTrackAction } from '../hooks/useTrackAction';

const VitalDetails = props => {
  const { runningUnitTest } = props;

  const records = useSelector(state => state.mr.vitals.vitalDetails);
  const vitalsList = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const { vitalType } = useParams();
  const dispatch = useDispatch();

  const perPage = 10;
  const [currentVitals, setCurrentVitals] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedVitals = useRef([]);
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const updatedRecordList = useSelector(
    state => state.mr.allergies.updatedList,
  );
  const listState = useSelector(state => state.mr.vitals.listState);
  const refresh = useSelector(state => state.mr.refresh);
  const [hasUsedPagination, setHasUsedPagination] = useState(false);

  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );

  const { isCerner, isAcceleratingVitals, isLoading } = useAcceleratedData();

  useTrackAction(statsdFrontEndActions.VITALS_DETAILS);

  const dispatchAction = useCallback(
    isCurrent => getVitals(isCurrent, isCerner, isAcceleratingVitals),
    [isCerner, isAcceleratingVitals],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: vitalsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction,
    dispatch,
    isLoading,
  });

  useEffect(
    /**
     * @returns a callback to automatically load any new records when unmounting this component
     */
    () => {
      return () => {
        dispatch(reloadRecords());
      };
    },
    [dispatch],
  );

  const updatedRecordType = useMemo(
    () => {
      const typeMap = {
        'heart-rate': 'PULSE',
        'breathing-rate': 'RESPIRATION',
        'blood-oxygen-level': 'PULSE_OXIMETRY',
      };
      return typeMap[vitalType] || vitalType;
    },
    [vitalType],
  );

  const onPageChange = page => {
    setCurrentVitals(paginatedVitals.current[page - 1]);
    setCurrentPage(page);
    setHasUsedPagination(true);
  };

  useEffect(
    () => {
      return () => {
        dispatch(clearVitalDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (records?.length) {
        updatePageTitle(
          `${vitalTypeDisplayNames[records[0].type]} Details - ${
            pageTitles.MEDICAL_RECORDS_PAGE_TITLE
          }`,
        );

        if (!hasUsedPagination) {
          // If pagination is not present, focus on the main heading (h1)
          focusElement(document.querySelector('h1'));
        } else {
          focusElement(document.querySelector('#showingRecords'));
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }
    },
    [currentPage, records, hasUsedPagination],
  );

  usePrintTitle(
    pageTitles.VITALS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const paginateData = data => {
    return chunk(data, perPage);
  };

  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  useEffect(
    () => {
      if (records?.length) {
        paginatedVitals.current = paginateData(records);
        setCurrentVitals(paginatedVitals.current[currentPage - 1]);
      }
    },
    [records],
  );

  const displayNums = fromToNums(currentPage, records?.length);

  useEffect(
    () => {
      if (updatedRecordType && !isLoading) {
        const formattedVitalType = macroCase(updatedRecordType);

        if (isCerner && vitalsList?.length) {
          dispatch(setVitalsList(formattedVitalType));
        } else {
          dispatch(getVitalDetails(formattedVitalType, vitalsList));
        }
      }
    },
    [vitalType, vitalsList, dispatch, updatedRecordType, isCerner, isLoading],
  );

  const lastUpdatedText = getLastUpdatedText(
    refresh.status,
    refreshExtractTypes.VPR,
  );

  const generateVitalsPdf = async () => {
    setDownloadStarted(true);

    const { title, subject, subtitles } = generateVitalsIntro(
      records,
      lastUpdatedText,
    );
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateVitalContent(records, true),
    };
    const pdfName = `VA-vital-details-${getNameDateAndTime(user)}`;
    try {
      await makePdf(
        pdfName,
        pdfData,
        'medicalRecords',
        'Medical Records - Vital details - PDF generation error',
        runningUnitTest,
      );
    } catch {
      // makePdf handles error logging to Datadog/Sentry
    }
  };

  const generateVitalsTxt = async () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${vitalTypeDisplayNames[records[0].type]}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
Showing ${records.length} records from newest to oldest
${records
      .map(
        vital => `${txtLine}\n\n
${vital.date}\n
Result: ${vital.measurement}\n
Location: ${vital.location}\n
Provider notes: ${vital.notes}\n\n`,
      )
      .join('')}`;
    generateTextFile(content, `VA-Vitals-details-${getNameDateAndTime(user)}`);
  };
  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.VITALS}
        className="vads-u-margin-bottom--9"
      />
    );
  }
  if (records?.length) {
    const vitalDisplayName = vitalTypeDisplayNames[records[0].type];
    const ddDisplayName = vitalDisplayName.includes('Blood oxygen level')
      ? 'Blood Oxygen'
      : vitalDisplayName;
    return (
      <>
        <PrintHeader />
        <HeaderSection
          header={vitalDisplayName}
          className="vads-u-margin-bottom--3 mobile-lg:vads-u-margin-bottom--4 no-print"
          data-dd-privacy="mask"
          data-dd-action-name="[vitals detail - name]"
        >
          <h2 className="sr-only">{`List of ${vitalDisplayName} results`}</h2>

          {!isCerner &&
            !isAcceleratingVitals && (
              <NewRecordsIndicator
                refreshState={refresh}
                extractType={refreshExtractTypes.VPR}
                newRecordsFound={
                  Array.isArray(vitalsList) &&
                  Array.isArray(updatedRecordList) &&
                  vitalsList.length !== updatedRecordList.length
                }
                reloadFunction={() => {
                  dispatch(reloadRecords());
                }}
              />
            )}

          {downloadStarted && <DownloadSuccessAlert />}

          <HeaderSection
            header={`Displaying ${displayNums[0]} to ${displayNums[1]} of ${
              records.length
            } records from newest to oldest`}
            className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans vads-u-padding-y--1 
          vads-u-margin-bottom--0 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print 
          vads-u-margin-top--3 mobile-lg:vads-u-margin-top--4"
            id="showingRecords"
          >
            <ul className="vital-records-list vads-u-margin--0 vads-u-padding--0 no-print">
              {currentVitals?.length > 0 &&
                currentVitals?.map((vital, idx) => (
                  <li
                    key={idx}
                    className="vads-u-margin--0 vads-u-padding-y--3 mobile-lg:vads-u-padding-y--4 vads-u-border-bottom--1px vads-u-border-color--gray-light"
                  >
                    <HeaderSection
                      header={
                        isCerner
                          ? formatDateInLocalTimezone(vital.effectiveDateTime)
                          : vital.date
                      }
                      data-testid="vital-date"
                      className="vads-u-font-size--md vads-u-margin-top--0 vads-u-margin-bottom--2 mobile-lg:vads-u-margin-bottom--3"
                      data-dd-privacy="mask"
                      data-dd-action-name="[vitals detail - date]"
                    >
                      <LabelValue
                        label="Result"
                        value={vital.measurement}
                        testId="vital-result"
                        actionName="[vitals detail - measurement]"
                      />
                      <LabelValue
                        label="Location"
                        value={vital.location}
                        testId="vital-location"
                        actionName="[vitals detail - location]"
                      />
                      <LabelValue
                        label="Provider notes"
                        value={vital.notes}
                        testId="vital-provider-note"
                        actionName="[vitals detail - note]"
                      />
                    </HeaderSection>
                  </li>
                ))}
            </ul>
          </HeaderSection>
        </HeaderSection>

        <div className="vads-u-margin-bottom--2 no-print">
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            onClick={() => {
              sendDataDogAction(`Pagination - ${vitalDisplayName}`);
            }}
            page={currentPage}
            pages={paginatedVitals.current.length}
            showLastPage
            uswds
          />
        </div>

        {/* print view start */}
        <h1
          className="vads-u-font-size--h1 vads-u-margin-bottom--1 print-only"
          data-dd-privacy="mask"
          data-dd-action-name="[vitals detail - name - Print]"
        >
          {vitalTypeDisplayNames[records[0].type]}
        </h1>
        <ul className="vital-records-list vads-u-margin--0 vads-u-padding--0 print-only">
          {records?.length > 0 &&
            records?.map((vital, idx) => (
              <li
                key={idx}
                className="vads-u-margin--0 vads-u-padding-y--3 vads-u-margin-left--1p5
                  vads-u-border-bottom--1px vads-u-border-color--gray-lightest"
              >
                <h3
                  className="vads-u-font-size--md vads-u-margin-top--0 vads-u-margin-bottom--2"
                  data-dd-privacy="mask"
                  data-dd-action-name="[vitals detail - date - Print]"
                >
                  {vital.date}
                </h3>
                <div className="vads-u-margin-bottom--0p5 vads-u-margin-left--1p5">
                  <h4 className="vads-u-display--inline vads-u-font-size--md vads-u-font-family--sans">
                    Measurement:{' '}
                  </h4>
                  <p
                    className="vads-u-display--inline"
                    data-dd-privacy="mask"
                    data-dd-action-name="[vitals detail - measurement - Print]"
                  >
                    {vital.measurement}
                  </p>
                </div>
                <div className="vads-u-margin-bottom--0p5 vads-u-margin-left--1p5">
                  <h4 className="vads-u-display--inline vads-u-font-size--md vads-u-font-family--sans">
                    Location:{' '}
                  </h4>
                  <p
                    className="vads-u-display--inline"
                    data-dd-privacy="mask"
                    data-dd-action-name="[vitals detail - location - Print]"
                  >
                    {vital.location}
                  </p>
                </div>
                <div className="vads-u-margin-left--1p5">
                  <h4 className="vads-u-display--inline vads-u-font-size--md vads-u-font-family--sans">
                    Provider notes:{' '}
                  </h4>
                  <p
                    className="vads-u-display--inline"
                    data-dd-privacy="mask"
                    style={{ whiteSpace: 'pre-line' }}
                    data-dd-action-name="[vitals detail - notes - Print]"
                  >
                    {vital.notes}
                  </p>
                </div>
              </li>
            ))}
        </ul>
        <DownloadingRecordsInfo description={ddDisplayName} />
        <PrintDownload
          description={ddDisplayName}
          downloadPdf={generateVitalsPdf}
          downloadTxt={generateVitalsTxt}
          list
        />
        <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
        {/* print view end */}
      </>
    );
  }
  if (!records?.length) {
    if (isLoading || listState === LOAD_STATES.FETCHING) {
      return (
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            message="Loading..."
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      );
    }
    return (
      <div className="vads-u-margin-y--8">
        <p>
          We don’t have any {vitalTypeDisplayNames[vitalType]} records for you
          right now. Go back to the vitals page to select a different vital.
        </p>
        <p>
          <a
            href="/my-health/medical-records/vitals"
            className="vads-u-margin-top--2"
          >
            Go back to the vitals page
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="vads-u-margin-y--8">
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    </div>
  );
};

export default VitalDetails;

VitalDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
// uswds on pagination
