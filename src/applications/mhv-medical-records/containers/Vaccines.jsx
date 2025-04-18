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
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { getVaccinesList, reloadRecords } from '../actions/vaccines';
import PrintHeader from '../components/shared/PrintHeader';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
  refreshExtractTypes,
  CernerAlertContent,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  getLastUpdatedText,
  formatNameFirstLast,
  sendDataDogAction,
  formatUserDob,
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
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';

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

  const lastUpdatedText = getLastUpdatedText(
    refresh.status,
    refreshExtractTypes.VPR,
  );

  const generateVaccinesPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateVaccinesIntro(
      vaccines,
      lastUpdatedText,
    );
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateVaccinesContent(vaccines),
    };
    const pdfName = `VA-vaccines-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Vaccines', runningUnitTest);
  };

  const generateVaccineListItemTxt = item => {
    setDownloadStarted(true);
    return `
${txtLine}\n\n
${item.name}\n
Date received: ${item.date}\n
Location: ${item.location}\n`;
  };

  const generateVaccinesTxt = async () => {
    const content = `
${crisisLineHeader}\n\n
Vaccines\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records. \n
Showing ${vaccines.length} records from newest to oldest
${vaccines.map(entry => generateVaccineListItemTxt(entry)).join('')}`;

    const fileName = `VA-vaccines-list-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  return (
    <div id="vaccines">
      <PrintHeader />
      <h1 className="vads-u-margin--0">Vaccines</h1>
      <p>
        This list includes all vaccines (immunizations) in your VA medical
        records. For a list of your allergies and reactions (including any
        reactions to vaccines), download your allergy records.
      </p>
      <div className="vads-u-margin-bottom--4">
        <Link
          to="/allergies"
          className="no-print"
          onClick={() => {
            sendDataDogAction('Go to your allergy records - Vaccines');
          }}
        >
          Go to your allergy records
        </Link>
      </div>

      <AcceleratedCernerFacilityAlert {...CernerAlertContent.VACCINES} />

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
          description="Vaccines - List"
          list
          downloadPdf={generateVaccinesPdf}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generateVaccinesTxt}
        />
        <DownloadingRecordsInfo
          allowTxtDownloads={allowTxtDownloads}
          description="Vaccines"
        />
        <RecordList records={vaccines} type={recordType.VACCINES} />
      </RecordListSection>
    </div>
  );
};

export default Vaccines;

Vaccines.propTypes = {
  runningUnitTest: PropTypes.bool,
};
