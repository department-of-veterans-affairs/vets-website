import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
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
import { makePdf, processList } from '../util/helpers';
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
        setBreadcrumbs(
          [{ url: '/my-health/medical-records/', label: 'Medical records' }],
          {
            url: '/my-health/medical-records/vaccines',
            label: 'VA vaccines',
          },
        ),
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

    const pdfName = `VA-Vaccines-list-${user.userFullName.first}-${
      user.userFullName.last
    }-${moment()
      .format('M-D-YYYY_hhmmssa')
      .replace(/\./g, '')}`;

    makePdf(pdfName, pdfData, 'Vaccines', runningUnitTest);
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
