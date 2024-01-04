import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
} from '../util/constants';
import { getAllergiesList } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { generateTextFile, getNameDateAndTime, makePdf } from '../util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import { txtLine } from '../../shared/util/constants';
import {
  generateAllergiesIntro,
  generateAllergiesContent,
} from '../util/pdfHelpers/allergies';

const Allergies = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const allergies = useSelector(state => state.mr.allergies.allergiesList);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const user = useSelector(state => state.user.profile);
  const activeAlert = useAlerts();

  useEffect(
    () => {
      dispatch(getAllergiesList());
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
      updatePageTitle(pageTitles.ALLERGIES_PAGE_TITLE);
    },
    [dispatch],
  );

  const generateAllergiesPdf = async () => {
    const { title, subject, preface } = generateAllergiesIntro();
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateAllergiesContent(allergies) };
    const pdfName = `VA-allergies-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Allergies', runningUnitTest);
  };

  const generateAllergiesTxt = async () => {
    const content = `
    Allergies and reactions \n 
    Review allergies, reactions, and side effects in your VA medical
    records. This includes medication side effects (also called adverse drug
    reactions). \n
    If you have allergies that are missing from this list, tell your care
    team at your next appointment. \n
    
    Showing ${allergies.length} from newest to oldest. \n
    ${allergies.map(
      entry =>
        `${txtLine} \n
      ${entry.name} \n
      \t Date entered: ${entry.date} \n
      \t Signs and symptoms: ${entry.reaction} \n
      \t Type of Allergy: ${entry.type} \n
      \t Location: ${entry.location} \n
      \t Observed or historical: ${entry.observedOrReported} \n
      \t Provider notes: ${entry.notes} \n`,
    )}`;

    generateTextFile(content, 'AllergyList');
  };

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return <AccessTroubleAlertBox alertType={accessAlertTypes.ALLERGY} />;
    }
    if (allergies?.length === 0) {
      return <NoRecordsMessage type="allergies or reactions" />;
    }
    if (allergies?.length) {
      return (
        <>
          <PrintDownload
            list
            download={generateAllergiesPdf}
            allowTxtDownloads={allowTxtDownloads}
            downloadTxt={generateAllergiesTxt}
          />
          <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          <RecordList records={allergies} type={recordType.ALLERGIES} />
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
    <div id="allergies">
      <PrintHeader />
      <h1 className="vads-u-margin--0">Allergies and reactions</h1>
      <p className="page-description">
        Review allergies, reactions, and side effects in your VA medical
        records. This includes medication side effects (also called adverse drug
        reactions).
      </p>
      <p className="page-description">
        If you have allergies that are missing from this list, tell your care
        team at your next appointment.
      </p>
      {content()}
    </div>
  );
};

export default Allergies;

Allergies.propTypes = {
  runningUnitTest: PropTypes.bool,
};
