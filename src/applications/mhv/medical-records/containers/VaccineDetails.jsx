import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  processList,
} from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import { clearVaccineDetails, getVaccineDetails } from '../actions/vaccines';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';
import DateSubheading from '../components/shared/DateSubheading';
import {
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../shared/util/constants';
import { generateVaccineItem } from '../util/pdfHelpers/vaccines';

const VaccineDetails = props => {
  const { runningUnitTest } = props;
  const record = useSelector(state => state.mr.vaccines.vaccineDetails);
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { vaccineId } = useParams();
  const dispatch = useDispatch();
  const activeAlert = useAlerts();

  useEffect(
    () => {
      if (vaccineId) {
        dispatch(getVaccineDetails(vaccineId, vaccines));
      }
    },
    [vaccineId, vaccines, dispatch],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/vaccines',
            label: 'Vaccines',
          },
        ]),
      );
      return () => {
        dispatch(clearVaccineDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (record) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(`${record.name} - ${pageTitles.VACCINES_PAGE_TITLE}`);
      }
    },
    [dispatch, record],
  );

  const generateVaccinePdf = async () => {
    const title = `Vaccines: ${record.name}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = { ...scaffold, details: generateVaccineItem(record) };
    const pdfName = `VA-Vaccines-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Vaccine details', runningUnitTest);
  };

  const generateVaccineTxt = async () => {
    const content = `
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Date entered: ${record.date}\n
${txtLine}\n\n
Location: ${record.location}\n
Provider notes: ${processList(record.notes)}\n`;

    const fileName = `VA-vaccines-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  const content = () => {
    if (activeAlert && activeAlert.type === ALERT_TYPE_ERROR) {
      return (
        <>
          <h1 className="vads-u-margin-bottom--0p5">Vaccine:</h1>
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.VACCINE}
            className="vads-u-margin-bottom--9"
          />
        </>
      );
    }
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0p5"
            aria-describedby="vaccine-date"
            data-dd-privacy="mask"
            data-testid="vaccine-name"
          >
            Vaccines: {record.name}
          </h1>
          <DateSubheading
            date={record.date}
            label="Date received"
            id="vaccine-date"
          />
          <PrintDownload
            download={generateVaccinePdf}
            allowTxtDownloads={allowTxtDownloads}
            downloadTxt={generateVaccineTxt}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          <div className="vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-color--gray-light" />
          <div>
            <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h2>
            <p
              className="vads-u-margin-top--0"
              data-dd-privacy="mask"
              data-testid="vaccine-location"
            >
              {record.location}
            </p>
            {/* <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              Reactions recorded by provider
            </h2>
            <ItemList list={record.reactions} /> */}
            <h2 className="vads-u-margin-top--2 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              Provider notes
            </h2>
            <ItemList list={record.notes} />
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
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      id="vaccine-details"
    >
      {content()}
    </div>
  );
};

export default VaccineDetails;

VaccineDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
