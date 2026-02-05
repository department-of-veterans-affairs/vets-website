import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
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
  useAcceleratedData,
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
  statsdFrontEndActions,
  loadStates,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getLastUpdatedText,
  sendDataDogAction,
} from '../util/helpers';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import RecordListSection from '../components/shared/RecordListSection';
import {
  generateVaccinesIntro,
  generateVaccinesContent,
} from '../util/pdfHelpers/vaccines';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';
import { Actions } from '../util/actionTypes';

const Vaccines = props => {
  const { runningUnitTest } = props;

  const dispatch = useDispatch();

  const {
    updatedList: updatedRecordList,
    listState,
    vaccinesList: vaccines,
    listCurrentAsOf: vaccinesCurrentAsOf,
  } = useSelector(state => state.mr.vaccines);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);

  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const { isLoading, isAcceleratingVaccines } = useAcceleratedData();

  const isLoadingAcceleratedData =
    isAcceleratingVaccines && listState === loadStates.FETCHING;

  const dispatchAction = isCurrent => {
    return getVaccinesList(isCurrent, isAcceleratingVaccines);
  };

  useTrackAction(statsdFrontEndActions.VITALS_LIST);

  useListRefresh({
    listState,
    listCurrentAsOf: vaccinesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction,
    dispatch,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.Vaccines.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

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
    try {
      await makePdf(
        pdfName,
        pdfData,
        'medicalRecords',
        'Medical Records - Vaccines - PDF generation error',
        runningUnitTest,
      );
    } catch {
      // makePdf handles error logging to Datadog/Sentry
    }
  };

  const generateVaccineListItemTxt = item => {
    const content = [
      `${txtLine}\n\n`,
      `${item.name}\n`,
      `Date received: ${item.date}\n`,
    ];

    // Add conditional fields based on whether accelerating vaccines is enabled
    if (isAcceleratingVaccines) {
      content.push(`Provider: ${item.location || 'None recorded'}\n`);
      content.push(`Type and dosage: ${item.shortDescription}\n`);
      content.push(`Manufacturer: ${item.manufacturer}\n`);
      content.push(`Series status: ${item.doseDisplay}\n`);
      content.push(`Dose number: ${item.doseNumber}\n`);
      content.push(`Dose series: ${item.doseSeries}\n`);
      content.push(`CVX code: ${item.cvxCode}\n`);
      content.push(`Reactions: ${item.reaction}\n`);
      content.push(`Notes: ${item.note}\n`);
    } else {
      content.push(`Location: ${item.location || 'None recorded'}\n`);
    }

    return content.join('');
  };
  const generateVaccinesTxt = async () => {
    setDownloadStarted(true);
    const content = [
      `${crisisLineHeader}\n\n`,
      `Vaccines\n`,
      `${formatNameFirstLast(user.userFullName)}\n`,
      `Date of birth: ${formatUserDob(user)}\n`,
      `${reportGeneratedBy}\n`,
      `This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records. \n`,
      `Showing ${vaccines.length} records from newest to oldest`,
      `${vaccines.map(entry => generateVaccineListItemTxt(entry)).join('')}`,
    ];

    const fileName = `VA-vaccines-list-${getNameDateAndTime(user)}`;

    generateTextFile(content.join(''), fileName);
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
      {downloadStarted && (
        <DownloadSuccessAlert className="vads-u-margin-bottom--3" />
      )}
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.VACCINE}
        recordCount={vaccines?.length}
        recordType={recordType.VACCINES}
        listCurrentAsOf={vaccinesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingVaccines && (
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
        )}

        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="vaccines-page-spinner"
              message="We’re loading your records."
              set-focus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
          !isLoading &&
          vaccines !== undefined && (
            <>
              {vaccines?.length ? (
                <>
                  <RecordList
                    records={vaccines?.map(vaccine => ({
                      ...vaccine,
                      isOracleHealthData: isAcceleratingVaccines,
                    }))}
                    type={recordType.VACCINES}
                  />

                  <DownloadingRecordsInfo description="Vaccines" />
                  <PrintDownload
                    description="Vaccines - List"
                    list
                    downloadPdf={generateVaccinesPdf}
                    downloadTxt={generateVaccinesTxt}
                  />
                  <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
                </>
              ) : (
                <NoRecordsMessage type={recordType.VACCINES} />
              )}
            </>
          )}
      </RecordListSection>
    </div>
  );
};

export default Vaccines;

Vaccines.propTypes = {
  runningUnitTest: PropTypes.bool,
};
