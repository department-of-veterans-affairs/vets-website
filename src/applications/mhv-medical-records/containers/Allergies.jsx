import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import {
  generatePdfScaffold,
  updatePageTitle,
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
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
  refreshExtractTypes,
  statsdFrontEndActions,
  loadStates,
  MEDS_BY_MAIL_FACILITY_ID,
} from '../util/constants';
import { getAllergiesList, reloadRecords } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import { generateTextFile, getLastUpdatedText } from '../util/helpers';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import RecordListSection from '../components/shared/RecordListSection';
import {
  generateAllergiesIntro,
  generateAllergiesContent,
} from '../util/pdfHelpers/allergies';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';
import { Actions } from '../util/actionTypes';

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

  const user = useSelector(state => state.user.profile);
  const { isLoading, isCerner, isAcceleratingAllergies } = useAcceleratedData();
  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  // Check if user has Meds by Mail facility (primarily CHAMPVA beneficiaries)
  // This determines whether to show conditional content about allergy records
  const hasMedsByMailFacility =
    user?.facilities?.some(
      ({ facilityId }) => facilityId === MEDS_BY_MAIL_FACILITY_ID,
    ) ?? false;

  const dispatchAction = isCurrent => {
    return getAllergiesList(isCurrent, isAcceleratingAllergies, isCerner);
  };

  useListRefresh({
    listState,
    listCurrentAsOf: allergiesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.ALLERGY,
    dispatchAction,
    dispatch,
  });

  useTrackAction(statsdFrontEndActions.ALLERGIES_LIST);

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.Allergies.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.ALLERGIES_PAGE_TITLE);
    },
    [dispatch],
  );

  const isLoadingAcceleratedData =
    isAcceleratingAllergies && listState === loadStates.FETCHING;

  usePrintTitle(
    pageTitles.ALLERGIES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const lastUpdatedText = getLastUpdatedText(
    refresh.status,
    refreshExtractTypes.ALLERGY,
  );

  const generateAllergiesPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateAllergiesIntro(
      allergies,
      lastUpdatedText,
      hasMedsByMailFacility,
    );
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateAllergiesContent(
        allergies,
        isAcceleratingAllergies || isCerner,
      ),
    };
    const pdfName = `VA-allergies-list-${getNameDateAndTime(user)}`;
    try {
      await makePdf(
        pdfName,
        pdfData,
        'medicalRecords',
        'Medical Records - Allergies - PDF generation error',
        runningUnitTest,
      );
    } catch {
      // makePdf handles error logging to Datadog/Sentry
    }
  };

  const generateAllergyListItemTxt = item => {
    setDownloadStarted(true);
    if (isCerner) {
      return `
${txtLine}\n\n
${item.name}\n
Date entered: ${item.date}\n
Signs and symptoms: ${item.reaction}\n
Type of Allergy: ${item.type}\n
Recorded By: ${item.provider}\n
Provider notes: ${item.notes}\n`;
    }
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
    // Conditional content based on whether user has Meds by Mail facility
    const additionalInfo = hasMedsByMailFacility
      ? `
If you use Meds by Mail

We may not have your allergy records in our My HealtheVet tools. But the Meds by Mail servicing center keeps a record of your allergies and reactions to medications.

If you have a new allergy or reaction, tell your provider. Or you can call us at 866-229-7389 or 888-385-0235 (TTY:711) and ask us to update your records. We're here Monday through Friday, 8:00 a.m. to 7:30 p.m. ET.\n`
      : '';

    const content = `
${crisisLineHeader}\n\n
Allergies and reactions\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
This list includes all allergies, reactions, and side effects in your VA medical records.${additionalInfo}
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

      {hasMedsByMailFacility && (
        <div className="vads-u-margin-bottom--2">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--1">
            If you use Meds by Mail
          </h2>
          <p>
            We may not have your allergy records in our My HealtheVet tools. But
            the Meds by Mail servicing center keeps a record of your allergies
            and reactions to medications.
          </p>
          <p>
            If you have a new allergy or reaction, tell your provider. Or you
            can call us at <va-telephone contact="8662297389" /> or{' '}
            <va-telephone contact="8883850235" /> (
            <va-telephone tty contact="711" />) and ask us to update your
            records. We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m.
            ET.
          </p>
        </div>
      )}

      {downloadStarted && (
        <DownloadSuccessAlert className="vads-u-margin-bottom--3" />
      )}
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.ALLERGY}
        recordCount={allergies?.length}
        recordType={recordType.ALLERGIES}
        listCurrentAsOf={allergiesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isCerner &&
          !isAcceleratingAllergies && (
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
          )}
        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="allergies-page-spinner"
              message="We’re loading your records."
              setFocus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
          !isLoading &&
          allergies !== undefined && (
            <>
              {allergies?.length ? (
                <>
                  <RecordList
                    records={allergies?.map(allergy => ({
                      ...allergy,
                      isOracleHealthData: isCerner,
                    }))}
                    type={recordType.ALLERGIES}
                  />
                  <DownloadingRecordsInfo description="Allergies" />
                  <PrintDownload
                    description="Allergies - List"
                    list
                    downloadPdf={generateAllergiesPdf}
                    downloadTxt={generateAllergiesTxt}
                  />
                  <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
                </>
              ) : (
                <NoRecordsMessage type={recordType.ALLERGIES} />
              )}
            </>
          )}
      </RecordListSection>
    </div>
  );
};

export default Allergies;

Allergies.propTypes = {
  runningUnitTest: PropTypes.bool,
};
