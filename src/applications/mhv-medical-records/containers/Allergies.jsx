import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  generatePdfScaffold,
  formatName,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
  refreshExtractTypes,
} from '../util/constants';
import { getAllergiesList, reloadRecords } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { generateTextFile, getNameDateAndTime, makePdf } from '../util/helpers';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import RecordListSection from '../components/shared/RecordListSection';
import {
  generateAllergiesIntro,
  generateAllergiesContent,
} from '../util/pdfHelpers/allergies';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';

const Allergies = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(
    state => state.mr.allergies.updatedList,
  );
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
  const [downloadStarted, setDownloadStarted] = useState(false);

  useListRefresh({
    listState,
    listCurrentAsOf: allergiesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.ALLERGY,
    dispatchAction: getAllergiesList,
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
    updatePageTitle,
  );

  const generateAllergiesPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, preface } = generateAllergiesIntro(allergies);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateAllergiesContent(allergies) };
    const pdfName = `VA-allergies-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Allergies', runningUnitTest);
  };

  const generateAllergyListItemTxt = item => {
    setDownloadStarted(true);
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
      {downloadStarted && <DownloadSuccessAlert />}
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.ALLERGY}
        recordCount={allergies?.length}
        recordType="allergies or reactions"
        listCurrentAsOf={allergiesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        <PrintDownload
          list
          downloadPdf={generateAllergiesPdf}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generateAllergiesTxt}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
        <NewRecordsIndicator
          refreshState={refresh}
          extractType={refreshExtractTypes.ALLERGY}
          newRecordsFound={
            Array.isArray(allergies) &&
            Array.isArray(updatedRecordList) &&
            allergies.length !== updatedRecordList.length
          }
          reloadFunction={() => {
            dispatch(reloadRecords());
          }}
        />
        <RecordList records={allergies} type={recordType.ALLERGIES} />
      </RecordListSection>
    </div>
  );
};

export default Allergies;

Allergies.propTypes = {
  runningUnitTest: PropTypes.bool,
};
