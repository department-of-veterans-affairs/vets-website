import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  processList,
} from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import { getVaccineDetails, clearVaccineDetails } from '../actions/vaccines';
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
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';

const VaccineDetails = props => {
  const { runningUnitTest } = props;
  const record = useSelector(state => state.mr.vaccines.vaccineDetails);
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
      if (vaccineId) dispatch(getVaccineDetails(vaccineId));
    },
    [vaccineId, dispatch],
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
        const titleDate = record.date ? `${record.date} - ` : '';
        updatePageTitle(
          `${titleDate}${record.name} - ${pageTitles.VACCINES_PAGE_TITLE}`,
        );
      }
    },
    [dispatch, record],
  );

  const generateVaccinePdf = async () => {
    const title = `Vaccines: ${record.name} on ${record.date}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      items: [
        {
          title: 'Location',
          value: record.location,
          inline: true,
        },
        {
          title: 'Reaction',
          value: processList(record.reactions),
          inline: !record.reactions.length,
        },
        {
          title: 'Provider notes',
          value: processList(record.notes),
          inline: !record.notes.length,
        },
      ],
    };

    const pdfName = `VA-Vaccines-details-${getNameDateAndTime(user)}`;

    makePdf(pdfName, scaffold, 'Vaccine details', runningUnitTest);
  };

  const generateVaccineTxt = async () => {
    const content = `
    ${record.name} \n
    Date entered: ${record.date} \n
    _____________________________________________________ \n
    \t Location: ${record.location} \n
    \t Reaction: ${processList(record.reactions)} \n
    \t Provider notes: ${processList(record.notes)} \n`;

    const fileName = `VA-Vaccines-details-${getNameDateAndTime(user)}`;

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
          >
            {record.name}
          </h1>
          <div className="time-header">
            <h2
              className="vads-u-font-size--base vads-u-font-family--sans"
              id="vaccine-date"
            >
              Date:{' '}
              <span
                className="vads-u-font-weight--normal"
                data-dd-privacy="mask"
                data-testid="header-time"
              >
                {record.date}
              </span>
            </h2>
          </div>
          <PrintDownload
            download={generateVaccinePdf}
            allowTxtDownloads={allowTxtDownloads}
            downloadTxt={generateVaccineTxt}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          <div className="detail-block max-80">
            <h2>Location</h2>
            <p data-dd-privacy="mask">{record.location}</p>
            <h2 className="vads-u-margin-bottom--0">
              Reactions recorded by provider
            </h2>
            <ItemList list={record.reactions} />
            <h2 className="vads-u-margin-bottom--0">Provider notes</h2>
            <ItemList list={record.notes} />
          </div>
        </>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
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
