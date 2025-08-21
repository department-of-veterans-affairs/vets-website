import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useHistory,
} from 'react-router-dom/cjs/react-router-dom.min';
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
  getNameDateAndTime,
  makePdf,
  formatNameFirstLast,
  formatUserDob,
} from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import RecordListNew from '../components/RecordList/RecordListNew';
import {
  getVaccinesList,
  reloadRecords,
  checkForVaccineUpdates,
} from '../actions/vaccines';
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
  getLastUpdatedText,
  sendDataDogAction,
  getParamValue,
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
import NoRecordsMessage from '../components/shared/NoRecordsMessage';

const Vaccines = props => {
  const { runningUnitTest } = props;

  const dispatch = useDispatch();

  const {
    updatedList: updatedRecordList,
    listState,
    vaccinesList: vaccines,
    listMetadata: metadata,
    updateNeeded,
    listCurrentAsOf: vaccinesCurrentAsOf,
  } = useSelector(state => state.mr.vaccines);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);
  const { allowTxtDownloads, useBackendPagination } = useSelector(state => {
    const toggles = state.featureToggles;
    return {
      allowTxtDownloads:
        toggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads],
      useBackendPagination:
        toggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsSupportNewModelVaccine],
    };
  });

  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const paramPage = getParamValue(location.search, 'page');

  useListRefresh({
    listState,
    listCurrentAsOf: vaccinesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getVaccinesList,
    dispatch,
    page: paramPage,
    useBackendPagination,
    checkUpdatesAction: checkForVaccineUpdates,
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
    makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      'Medical Records - Vaccines - PDF generation error',
      runningUnitTest,
    );
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

  /**
   * Change to page 1 and fetch the list of vaccines from the server.
   */
  const loadUpdatedRecords = () => {
    if (paramPage === '1') {
      dispatch(getVaccinesList(true, paramPage, useBackendPagination));
    } else {
      // The page change will trigger a fetch.
      history.push(`${history.location.pathname}?page=1`);
    }
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
        recordCount={
          useBackendPagination
            ? metadata?.pagination?.totalEntries
            : vaccines?.length
        }
        recordType={recordType.VACCINES}
        listCurrentAsOf={vaccinesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        <NewRecordsIndicator
          refreshState={refresh}
          extractType={refreshExtractTypes.VPR}
          newRecordsFound={
            useBackendPagination
              ? updateNeeded
              : Array.isArray(vaccines) &&
                Array.isArray(updatedRecordList) &&
                vaccines.length !== updatedRecordList.length
          }
          reloadFunction={
            useBackendPagination
              ? loadUpdatedRecords
              : () => {
                  dispatch(reloadRecords());
                }
          }
        />

        {vaccines?.length ? (
          <>
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
            {useBackendPagination && vaccines ? (
              <RecordListNew
                records={vaccines}
                type={recordType.VACCINES}
                metadata={metadata}
              />
            ) : (
              <RecordList records={vaccines} type={recordType.VACCINES} />
            )}
          </>
        ) : (
          <NoRecordsMessage type={recordType.VACCINES} />
        )}
      </RecordListSection>
    </div>
  );
};

export default Vaccines;

Vaccines.propTypes = {
  runningUnitTest: PropTypes.bool,
};
