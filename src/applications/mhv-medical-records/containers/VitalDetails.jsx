import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  clearVitalDetails,
  getVitalDetails,
  getVitals,
  reloadRecords,
} from '../actions/vitals';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import {
  getNameDateAndTime,
  macroCase,
  makePdf,
  generateTextFile,
} from '../util/helpers';
import {
  vitalTypeDisplayNames,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateVitalsContent,
  generateVitalsIntro,
} from '../util/pdfHelpers/vitals';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import { useIsDetails } from '../hooks/useIsDetails';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import useListRefresh from '../hooks/useListRefresh';

const MAX_PAGE_LIST_LENGTH = 10;
const VitalDetails = props => {
  const { runningUnitTest } = props;
  const records = useSelector(state => state.mr.vitals.vitalDetails);
  const vitalsList = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { vitalType } = useParams();
  const dispatch = useDispatch();

  const perPage = 10;
  const [currentVitals, setCurrentVitals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedVitals = useRef([]);
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const updatedRecordList = useSelector(
    state => state.mr.allergies.updatedList,
  );
  const listState = useSelector(state => state.mr.vitals.listState);
  const refresh = useSelector(state => state.mr.refresh);

  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );
  const mockPhr = useSelector(
    state => state.featureToggles.mhv_medical_records_mock_phr,
  );

  useListRefresh({
    listState,
    listCurrentAsOf: vitalsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getVitals,
    dispatch,
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

  useIsDetails(dispatch);

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

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/vitals',
            label: 'vitals',
          },
        ]),
      );
      return () => {
        dispatch(clearVitalDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (records?.length) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(
          `${vitalTypeDisplayNames[records[0].type]} - ${
            pageTitles.VITALS_PAGE_TITLE
          }`,
        );
      }
    },
    [records],
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

  const onPageChange = page => {
    setCurrentVitals(paginatedVitals.current[page - 1]);
    setCurrentPage(page);
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

  useEffect(
    () => {
      if (currentPage > 1 && records?.length) {
        focusElement(document.querySelector('#showingRecords'));
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    },
    [currentPage, records],
  );

  const displayNums = fromToNums(currentPage, records?.length);

  useEffect(
    () => {
      if (updatedRecordType) {
        const formattedVitalType = macroCase(updatedRecordType);
        dispatch(getVitalDetails(formattedVitalType, vitalsList));
      }
    },
    [vitalType, vitalsList, dispatch],
  );

  const generateVitalsPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, preface } = generateVitalsIntro(records);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateVitalsContent(records) };
    const pdfName = `VA-vital-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Vital details', runningUnitTest);
  };

  const generateVitalsTxt = async () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${vitalTypeDisplayNames[records[0].type]}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
${records
      .map(
        vital => `${txtLine}\n\n
Date entered: ${vital.date}\n
Details about this test\n
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
    return (
      <>
        <PrintHeader />
        <h1 className="vads-u-margin-bottom--3 small-screen:vads-u-margin-bottom--4 no-print">
          {vitalDisplayName}
        </h1>
        {!mockPhr && (
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
        <PrintDownload
          downloadPdf={generateVitalsPdf}
          downloadTxt={generateVitalsTxt}
          allowTxtDownloads={allowTxtDownloads}
          list
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />

        <h2
          className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans vads-u-padding-y--1 
            vads-u-margin-bottom--0 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print 
            vads-u-margin-top--3 small-screen:vads-u-margin-top--4"
          id="showingRecords"
        >
          {`Displaying ${displayNums[0]} to ${displayNums[1]} of ${
            records.length
          } records from newest to oldest`}
        </h2>

        <ul className="vital-records-list vads-u-margin--0 vads-u-padding--0 no-print">
          {currentVitals?.length > 0 &&
            currentVitals?.map((vital, idx) => (
              <li
                key={idx}
                className="vads-u-margin--0 vads-u-padding-y--3 small-screen:vads-u-padding-y--4 vads-u-border-bottom--1px vads-u-border-color--gray-light"
              >
                <h3
                  data-testid="vital-date"
                  className="vads-u-font-size--md vads-u-margin-top--0 vads-u-margin-bottom--2 small-screen:vads-u-margin-bottom--3"
                  data-dd-privacy="mask"
                >
                  {vital.date}
                </h3>
                <h4 className="vads-u-font-size--base vads-u-margin--0 vads-u-font-family--sans">
                  Result
                </h4>
                <p
                  data-testid="vital-result"
                  className="vads-u-margin-top--0 vads-u-margin-bottom--2"
                  data-dd-privacy="mask"
                >
                  {vital.measurement}
                </p>
                <h4 className="vads-u-font-size--base vads-u-margin--0 vads-u-font-family--sans">
                  Location
                </h4>
                <p
                  data-testid="vital-location"
                  className="vads-u-margin-top--0 vads-u-margin-bottom--2"
                  data-dd-privacy="mask"
                >
                  {vital.location}
                </p>
                <h4 className="vads-u-font-size--base vads-u-margin--0 vads-u-font-family--sans">
                  Provider notes
                </h4>
                <p
                  data-testid="vital-provider-note"
                  className="vads-u-margin--0"
                  data-dd-privacy="mask"
                >
                  {vital.notes}
                </p>
              </li>
            ))}
        </ul>

        {/* print view start */}
        <h1 className="vads-u-font-size--h1 vads-u-margin-bottom--1 print-only">
          Vitals: {vitalTypeDisplayNames[records[0].type]}
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
                >
                  {vital.date}
                </h3>
                <div className="vads-u-margin-bottom--0p5 vads-u-margin-left--1p5">
                  <h4 className="vads-u-display--inline vads-u-font-size--base vads-u-font-family--sans">
                    Measurement:{' '}
                  </h4>
                  <p className="vads-u-display--inline" data-dd-privacy="mask">
                    {vital.measurement}
                  </p>
                </div>
                <div className="vads-u-margin-bottom--0p5 vads-u-margin-left--1p5">
                  <h4 className="vads-u-display--inline vads-u-font-size--base vads-u-font-family--sans">
                    Location:{' '}
                  </h4>
                  <p className="vads-u-display--inline" data-dd-privacy="mask">
                    {vital.location}
                  </p>
                </div>
                <div className="vads-u-margin-left--1p5">
                  <h4 className="vads-u-display--inline vads-u-font-size--base vads-u-font-family--sans">
                    Provider notes:{' '}
                  </h4>
                  <p className="vads-u-display--inline" data-dd-privacy="mask">
                    {vital.notes}
                  </p>
                </div>
              </li>
            ))}
        </ul>
        {/* print view end */}

        <div className="vads-u-margin-bottom--2 no-print">
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={currentPage}
            pages={paginatedVitals.current.length}
            maxPageListLength={MAX_PAGE_LIST_LENGTH}
            showLastPage
            uswds
          />
        </div>
      </>
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
