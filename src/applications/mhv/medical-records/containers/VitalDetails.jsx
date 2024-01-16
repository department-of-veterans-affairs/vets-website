import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { clearVitalDetails, getVitalDetails } from '../actions/vitals';
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
} from '../util/constants';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
} from '../../shared/util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import {
  txtLine,
  crisisLineHeader,
  reportGeneratedBy,
} from '../../shared/util/constants';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateVitalsContent,
  generateVitalsIntro,
} from '../util/pdfHelpers/vitals';

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

  const perPage = 5;
  const [currentVitals, setCurrentVitals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedVitals = useRef([]);
  const activeAlert = useAlerts();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/vitals',
            label: 'Vitals',
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
    [currentPage, records],
  );

  const displayNums = fromToNums(currentPage, records?.length);

  useEffect(
    () => {
      if (vitalType) {
        const formattedVitalType = macroCase(vitalType);
        dispatch(getVitalDetails(formattedVitalType, vitalsList));
      }
    },
    [vitalType, vitalsList, dispatch],
  );

  const generateVitalsPdf = async () => {
    const { title, subject, preface } = generateVitalsIntro();
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateVitalsContent(records) };
    const pdfName = `VA-vital-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Vital details', runningUnitTest);
  };

  const generateVitalsTxt = async () => {
    const content = `\n
${crisisLineHeader}\n\n
${vitalTypeDisplayNames[records[0].type]}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
${records
      .map(
        vital =>
          `${txtLine}\n\n
Date entered: ${vital.date}\n
Details about this test\n
Result: ${vital.measurement}\n
Location: ${vital.location}\n
Provider Notes: ${vital.notes}\n\n`,
      )
      .join('')}`;
    generateTextFile(content, `VA-Vitals-details-${getNameDateAndTime(user)}`);
  };
  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  if (accessAlert) {
    return <AccessTroubleAlertBox alertType={accessAlertTypes.VITALS} />;
  }
  if (records?.length) {
    const vitalDisplayName = vitalTypeDisplayNames[records[0].type];
    const vitalDisplayNameLowerCase = vitalDisplayName.toLowerCase();
    return (
      <>
        <PrintHeader />
        <h1 className="vads-u-margin-bottom--1 no-print">{vitalDisplayName}</h1>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--3 no-print">
          Your VA providers check your {vitalDisplayNameLowerCase} at
          appointments. Review your {vitalDisplayNameLowerCase} results here.
        </p>
        <PrintDownload
          download={generateVitalsPdf}
          downloadTxt={generateVitalsTxt}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
        <h2
          className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans vads-u-padding-y--1 
            vads-u-margin-bottom--0 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print"
        >
          {`Displaying ${displayNums[0]}–${displayNums[1]} of ${
            records.length
          } records from newest to oldest`}
        </h2>

        <ul className="vital-records-list vads-u-margin--0 vads-u-padding--0 no-print">
          {currentVitals?.length > 0 &&
            currentVitals?.map((vital, idx) => (
              <li
                key={idx}
                className="vads-u-margin--0 vads-u-padding-y--3 vads-u-border-bottom--1px vads-u-border-color--gray-lightest"
              >
                <h3
                  data-testid="vital-date"
                  className="vads-u-font-size--md vads-u-margin-top--0 vads-u-margin-bottom--2"
                  data-dd-privacy="mask"
                >
                  {vital.date}
                </h3>
                <h4 className="vads-u-font-size--base vads-u-margin--0 vads-u-font-family--sans">
                  Measurement:
                </h4>
                <p
                  data-testid="vital-result"
                  className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                  data-dd-privacy="mask"
                >
                  {vital.measurement}
                </p>
                <h4 className="vads-u-font-size--base vads-u-margin--0 vads-u-font-family--sans">
                  Location:
                </h4>
                <p
                  data-testid="vital-location"
                  className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                  data-dd-privacy="mask"
                >
                  {vital.location}
                </p>
                <h4 className="vads-u-font-size--base vads-u-margin--0 vads-u-font-family--sans">
                  Provider notes:
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
          Vitals
        </h1>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2 print-only">
          This list includes vitals and other basic health numbers your
          providers check at your appointments.
        </p>
        <h2 className="vads-u-font-size--lg vads-u-margin--0 print-only">
          {vitalTypeDisplayNames[records[0].type]}
        </h2>
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
