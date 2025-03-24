import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { isBefore, isAfter } from 'date-fns';
import RecordList from '../components/RecordList/RecordList';
import {
  recordType,
  ALERT_TYPE_ERROR,
  pageTitles,
  accessAlertTypes,
  refreshExtractTypes,
  CernerAlertContent,
  SortTypes,
} from '../util/constants';
import { getAllergiesList, reloadRecords } from '../actions/allergies';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  getLastUpdatedText,
  formatNameFirstLast,
  formatUserDob,
} from '../util/helpers';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import RecordListSection from '../components/shared/RecordListSection';
import {
  generateAllergiesIntro,
  generateAllergiesContent,
} from '../util/pdfHelpers/allergies';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';

import useAcceleratedData from '../hooks/useAcceleratedData';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import SortRecordList from '../components/RecordList/SortRecordList';

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

  const allowFilterSort = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort],
  );

  const user = useSelector(state => state.user.profile);
  const { isAcceleratingAllergies } = useAcceleratedData();

  const activeAlert = useAlerts(dispatch);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const [selectedSort, setSelectedSort] = useState(
    allowFilterSort ? SortTypes.ALPHABETICAL.value : '',
  );

  const sortString = useMemo(
    () => {
      switch (selectedSort) {
        case SortTypes.ALPHABETICAL.value:
          return SortTypes.ALPHABETICAL.label;
        case SortTypes.ASC_DATE.value:
          return SortTypes.ASC_DATE.labelWithDateEntered;
        case SortTypes.DSC_DATE.value:
          return SortTypes.DSC_DATE.labelWithDateEntered;
        default:
          return SortTypes.ALPHABETICAL.label;
      }
    },
    [selectedSort],
  );

  const sortedAllergies = useMemo(
    () => {
      switch (selectedSort) {
        case SortTypes.ALPHABETICAL.value:
          return allergies?.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        case SortTypes.ASC_DATE.value:
          return allergies?.sort((a, b) => {
            return isBefore(new Date(a.date), new Date(b.date));
          });
        case SortTypes.DSC_DATE.value:
          return allergies?.sort((a, b) => {
            return isAfter(new Date(a.date), new Date(b.date));
          });
        default:
          return allergies;
      }
    },
    [selectedSort, allergies],
  );

  const dispatchAction = isCurrent => {
    return getAllergiesList(isCurrent, isAcceleratingAllergies);
  };

  useListRefresh({
    listState,
    listCurrentAsOf: allergiesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.ALLERGY,
    dispatchAction,
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

  const lastUpdatedText = getLastUpdatedText(
    refresh.status,
    refreshExtractTypes.ALLERGY,
  );

  const generateAllergiesPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateAllergiesIntro(
      refresh.status,
      lastUpdatedText,
      sortString,
    );
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateAllergiesContent(sortedAllergies, isAcceleratingAllergies),
    };
    const pdfName = `VA-allergies-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Allergies', runningUnitTest);
  };

  const generateAllergyListItemTxt = item => {
    setDownloadStarted(true);
    if (isAcceleratingAllergies) {
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
    const content = `
${crisisLineHeader}\n\n
Allergies and reactions\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
This list includes all allergies, reactions, and side effects in your VA medical records. 
If you have allergies or reactions that are missing from this list, 
tell your care team at your next appointment.\n
Showing ${allergies.length} records, ${sortString}
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

      <CernerFacilityAlert {...CernerAlertContent.ALLERGIES} />

      {downloadStarted && <DownloadSuccessAlert />}
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.ALLERGY}
        recordCount={allergies?.length}
        recordType="allergies or reactions"
        listCurrentAsOf={allergiesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingAllergies && (
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
        {allowFilterSort ? (
          <SortRecordList
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            showDateEntered
          />
        ) : (
          <>
            <PrintDownload
              description="Allergies - List"
              list
              downloadPdf={generateAllergiesPdf}
              allowTxtDownloads={allowTxtDownloads}
              downloadTxt={generateAllergiesTxt}
            />
            <DownloadingRecordsInfo
              allowTxtDownloads={allowTxtDownloads}
              description="Allergies"
            />
          </>
        )}
        <RecordList
          records={sortedAllergies?.map(allergy => ({
            ...allergy,
            isOracleHealthData: isAcceleratingAllergies,
          }))}
          type={recordType.ALLERGIES}
          sortedBy={sortString}
        />
      </RecordListSection>
      {allowFilterSort && (
        <>
          <DownloadingRecordsInfo
            allowTxtDownloads={allowTxtDownloads}
            description="Allergies"
          />
          <PrintDownload
            description="Allergies - List"
            list
            downloadPdf={generateAllergiesPdf}
            allowTxtDownloads={allowTxtDownloads}
            downloadTxt={generateAllergiesTxt}
          />
          <div className="vads-u-margin-bottom--5 no-print" />
        </>
      )}
    </div>
  );
};

export default Allergies;

Allergies.propTypes = {
  runningUnitTest: PropTypes.bool,
};
