import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
  refreshExtractTypes,
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
  formatName,
} from '../../shared/util/helpers';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import {
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../shared/util/constants';
import {
  generateAllergiesIntro,
  generateAllergiesContent,
} from '../util/pdfHelpers/allergies';
import usePrintTitle from '../../shared/hooks/usePrintTitle';

const Allergies = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const listState = useSelector(state => state.mr.allergies.listState);
  const allergies = useSelector(state => state.mr.allergies.allergiesList);
  const allergiesCurrentAsOf = useSelector(
    state => state.mr.allergies.listCurrentAsOf,
  );
  const refresh = useSelector(state => state.mr.refresh);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const user = useSelector(state => state.user.profile);
  const activeAlert = useAlerts(dispatch);

  useListRefresh({
    listState,
    listCurrentAsOf: allergiesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.ALLERGY,
    dispatchAction: getAllergiesList,
    dispatch,
  });

  useEffect(
    () => {
      dispatch(setBreadcrumbs([{ url: '/', label: 'Medical records' }]));
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.ALLERGIES_PAGE_TITLE);
    },
    [dispatch],
  );

  usePrintTitle(
    pageTitles.ALLERGIES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    formatDateLong,
    updatePageTitle,
  );

  const generateAllergiesPdf = async () => {
    const { title, subject, preface } = generateAllergiesIntro(allergies);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateAllergiesContent(allergies) };
    const pdfName = `VA-allergies-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Allergies', runningUnitTest);
  };

  const generateAllergyListItemTxt = item => {
    return `
${txtLine}\n\n
${item.name}\n
Date entered: ${item.date}\n
Signs and symptoms: ${item.reaction}\n
Type of Allergy: ${item.type}\n
Location: ${item.location}\n
Observed or historical: ${item.observedOrReported}\n
Provider notes: ${item.notes}\n`;
  };

  const generateAllergiesTxt = async () => {
    const content = `
${crisisLineHeader}\n\n
Allergies and reactions\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Review allergies, reactions, and side effects in your VA medical
records. This includes medication side effects (also called adverse drug
reactions).\n
If you have allergies that are missing from this list, tell your care
team at your next appointment.\n
Showing ${allergies.length} from newest to oldest
${allergies.map(entry => generateAllergyListItemTxt(entry)).join('')}`;

    const fileName = `VA-allergies-list-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
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
