import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { getVaccinesList, reloadRecords } from '../actions/vaccines';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
  refreshExtractTypes,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  processList,
} from '../util/helpers';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import RecordListSection from '../components/shared/RecordListSection';
import {
  generateVaccinesIntro,
  generateVaccinesContent,
} from '../util/pdfHelpers/vaccines';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';

const Vaccines = props => {
  const { runningUnitTest } = props;
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(state => state.mr.vaccines.updatedList);
  const listState = useSelector(state => state.mr.vaccines.listState);
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);
  const vaccinesCurrentAsOf = useSelector(
    state => state.mr.vaccines.listCurrentAsOf,
  );
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useListRefresh({
    listState,
    listCurrentAsOf: vaccinesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getVaccinesList,
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
      updatePageTitle(pageTitles.VACCINES_PAGE_TITLE);
    },
    [dispatch],
  );

  usePrintTitle(
    pageTitles.VACCINES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    formatDateLong,
    updatePageTitle,
  );

  const generateVaccinesPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, preface } = generateVaccinesIntro();
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateVaccinesContent(vaccines) };
    const pdfName = `VA-vaccines-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Vaccines', runningUnitTest);
  };

  const generateVaccineListItemTxt = item => {
    setDownloadStarted(true);
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
      {downloadStarted && <DownloadSuccessAlert />}
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.VACCINE}
        recordCount={vaccines?.length}
        recordType={recordType.VACCINES}
        listCurrentAsOf={vaccinesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        <NewRecordsIndicator
          refreshState={refresh}
          extractType={refreshExtractTypes.VPR}
          newRecordsFound={
            Array.isArray(vaccines) &&
            Array.isArray(updatedRecordList) &&
            vaccines.length !== updatedRecordList.length
          }
          reloadFunction={() => {
            dispatch(reloadRecords());
          }}
        />
        <PrintDownload
          list
          downloadPdf={generateVaccinesPdf}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generateVaccinesTxt}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
        <RecordList records={vaccines} type={recordType.VACCINES} />
      </RecordListSection>
    </div>
  );
};

export default Vaccines;

Vaccines.propTypes = {
  runningUnitTest: PropTypes.bool,
};
