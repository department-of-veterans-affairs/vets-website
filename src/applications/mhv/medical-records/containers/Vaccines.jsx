import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
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
  formatName,
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import {
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../shared/util/constants';
import {
  generateVaccinesIntro,
  generateVaccinesContent,
} from '../util/pdfHelpers/vaccines';

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
    const { title, subject, preface } = generateVaccinesIntro();
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateVaccinesContent(vaccines) };
    const pdfName = `VA-vaccines-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Vaccines', runningUnitTest);
  };

  const generateVaccineListItemTxt = item => {
    return `
${txtLine}\n\n
${item.name}\n
Date received: ${item.date}\n
Location: ${item.location}\n
Reaction: ${processList(item.reactions)}\n
Provider notes: ${processList(item.notes)}\n`;
  };

  const generateVaccinesTxt = async () => {
    const content = `
${crisisLineHeader}\n\n
Vaccines\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
This list includes vaccines you got at VA health facilities and from providers or pharmacies in our community care network. It may not include vaccines you got outside our network.\n
For complete records of your allergies and reactions to vaccines, review your allergy records.\n
Showing ${vaccines.length} records from newest to oldest
${vaccines.map(entry => generateVaccineListItemTxt(entry)).join('')}`;

    const fileName = `VA-vaccines-list-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return <AccessTroubleAlertBox alertType={accessAlertTypes.VACCINE} />;
    }
    if (vaccines?.length === 0) {
      return <NoRecordsMessage type={recordType.VACCINES} />;
    }
    if (vaccines?.length) {
      return (
        <>
          <PrintDownload
            list
            download={generateVaccinesPdf}
            allowTxtDownloads={allowTxtDownloads}
            downloadTxt={generateVaccinesTxt}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          <RecordList records={vaccines} type={recordType.VACCINES} />
        </>
      );
    }
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="We’re loading your records. This could take up to a minute."
          setFocus
          data-testid="loading-indicator"
        />
      </div>
    );
  };

  return (
    <div id="vaccines">
      <PrintHeader />
      <h1 className="vads-u-margin--0">Vaccines</h1>
      <p>Review vaccines (immunizations) in your VA medical records.</p>
      <p className="vads-u-margin-bottom--4">
        For a list of your allergies and reactions (including any reactions to
        vaccines), go to your allergy records.{' '}
        <Link to="/allergies" className="no-print">
          Go to your allergy records
        </Link>
      </p>
      {content()}
    </div>
  );
};

export default Vaccines;

Vaccines.propTypes = {
  runningUnitTest: PropTypes.bool,
};
