import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RecordList from '../components/RecordList/RecordList';
import { getVaccinesList } from '../actions/vaccines';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  processList,
} from '../util/helpers';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';

const Vaccines = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const activeAlert = useAlerts();

  useEffect(
    () => {
      dispatch(getVaccinesList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          { url: '/my-health/medical-records/', label: 'Medical records' },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.VACCINES_PAGE_TITLE);
    },
    [dispatch],
  );

  const generateVaccinesPdf = async () => {
    const title = 'Vaccines';
    const subject = 'VA Medical Record';
    const preface =
      'Your VA Vaccines list may not be complete. If you have any questions about your information, visit the FAQs or contact your VA Health care team.';
    const pdfData = generatePdfScaffold(user, title, subject, preface);
    pdfData.results = { items: [] };

    vaccines.forEach(item => {
      pdfData.results.items.push({
        header: item.name,
        items: [
          {
            title: 'Date received',
            value: item.date,
            inline: true,
          },
          {
            title: 'Location',
            value: item.location,
            inline: true,
          },
          {
            title: 'Reaction',
            value: processList(item.reactions),
            inline: !item.reactions.length,
          },
          {
            title: 'Provider notes',
            value: processList(item.notes),
            inline: !item.notes.length,
          },
        ],
      });
    });

    const pdfName = `VA-Vaccines-list-${getNameDateAndTime(user)}`;

    makePdf(pdfName, pdfData, 'Vaccines', runningUnitTest);
  };

  const generateVaccinesTxt = async () => {
    const content = `
    Vaccines\n 
    For a list of your allergies and reactions (including any reactions to
    vaccines), go to your allergy records. \n
    If you have Vaccines that are missing from this list, tell your care
    team at your next appointment. \n
    
    Showing ${vaccines.length} from newest to oldest. \n
    ${vaccines.map(
      entry => `_____________________________________________________ \n
      ${entry.name} \n 
      \t Date received: ${entry.date} \n
      \t Location: ${entry.location} \n
      \t Reaction: ${processList(entry.reactions)} \n
      \t Provider notes: ${processList(entry.notes)} \n`,
    )}`;

    const fileName = `VA-Vaccines-list-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return <AccessTroubleAlertBox alertType={accessAlertTypes.VACCINE} />;
    }
    if (vaccines?.length) {
      return <RecordList records={vaccines} type={recordType.VACCINES} />;
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
    <div id="vaccines">
      <PrintHeader />
      <h1 className="page-title">Vaccines</h1>
      <p>
        For a list of your allergies and reactions (including any reactions to
        vaccines), go to your allergy records.
      </p>
      <Link
        to="/allergies"
        className="vads-u-display--block vads-u-margin-bottom--3 no-print"
      >
        Go to your allergy records
      </Link>
      <PrintDownload
        list
        download={generateVaccinesPdf}
        allowTxtDownloads={allowTxtDownloads}
        downloadTxt={generateVaccinesTxt}
      />
      <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      {content()}
    </div>
  );
};

export default Vaccines;

Vaccines.propTypes = {
  runningUnitTest: PropTypes.bool,
};
