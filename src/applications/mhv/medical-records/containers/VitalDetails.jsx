import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { clearVitalDetails, getVitalDetails } from '../actions/vitals';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import { getNameDateAndTime, macroCase, makePdf } from '../util/helpers';
import {
  vitalTypeDisplayNames,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
} from '../util/constants';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../shared/util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';

const MAX_PAGE_LIST_LENGTH = 5;
const VitalDetails = props => {
  const { runningUnitTest } = props;
  const records = useSelector(state => state.mr.vitals.vitalDetails);
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
        dispatch(getVitalDetails(macroCase(vitalType)));
      }
    },
    [vitalType, dispatch],
  );

  const generateVitalsPdf = async () => {
    const title = `Vitals`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      items: [
        {
          title: 'Result',
          value: records.measurement,
          inline: true,
        },
        {
          title: 'Location',
          value: records.location,
          inline: true,
        },
        {
          title: 'Provider notes',
          value: records.notes,
          inline: !records.notes,
        },
      ],
    };

    const pdfName = `VA-Vital-details-${getNameDateAndTime(user)}`;

    makePdf(pdfName, scaffold, 'Vital details', runningUnitTest);
  };

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return <AccessTroubleAlertBox alertType={accessAlertTypes.VITALS} />;
    }
    if (records?.length) {
      return (
        <>
          <h1>{vitalTypeDisplayNames[records[0].type]}</h1>
          <PrintDownload
            download={generateVitalsPdf}
            allowTxtDownloads={allowTxtDownloads}
          />
          <div className="vads-u-padding-y--1 vads-u-margin-bottom--0 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print">
            Displaying {displayNums[0]}
            &#8211;
            {displayNums[1]} of {records.length} vitals
          </div>

          <ul className="vital-details no-print">
            {currentVitals?.length > 0 &&
              currentVitals?.map((vital, idx) => (
                <li key={idx}>
                  <h2 data-dd-privacy="mask">
                    {moment(vital.date).format('LLL')}
                  </h2>
                  <h3>Result:</h3>
                  <p
                    className="vads-u-margin-bottom--1 vads-u-margin-top--0"
                    data-dd-privacy="mask"
                  >
                    {vital.measurement}
                  </p>
                  <h3>Location:</h3>
                  <p
                    className="vads-u-margin-bottom--1 vads-u-margin-top--0"
                    data-dd-privacy="mask"
                  >
                    {vital.location}
                  </p>
                  <h3>Provider notes:</h3>
                  <p
                    className="vads-u-margin-bottom--1 vads-u-margin-top--0"
                    data-dd-privacy="mask"
                  >
                    {vital.notes}
                  </p>
                </li>
              ))}
          </ul>

          {/* print view start */}
          <ul className="vital-details print-only">
            {records?.length > 0 &&
              records?.map((vital, idx) => (
                <li key={idx}>
                  <h2 data-dd-privacy="mask">
                    {moment(vital.date).format('LLL')}
                  </h2>
                  <h3>Result:</h3>
                  <p data-dd-privacy="mask">{vital.measurement}</p>
                  <h3>Location:</h3>
                  <p data-dd-privacy="mask">{vital.location}</p>
                  <h3>Provider notes:</h3>
                  <p
                    className="vads-u-margin-bottom--1 vads-u-margin-top--0"
                    data-dd-privacy="mask"
                  >
                    {vital.notes}
                  </p>
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

  return (
    <>
      <PrintHeader />

      {content()}
    </>
  );
};

export default VitalDetails;

VitalDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
