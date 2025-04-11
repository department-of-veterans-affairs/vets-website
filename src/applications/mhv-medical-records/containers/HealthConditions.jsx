import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { isBefore, isAfter } from 'date-fns';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import RecordList from '../components/RecordList/RecordList';
import { getConditionsList, reloadRecords } from '../actions/conditions';
import {
  recordType,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
  CernerAlertContent,
  SortTypes,
} from '../util/constants';
import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import SortRecordList from '../components/RecordList/SortRecordList';

const HealthConditions = () => {
  const ABOUT_THE_CODES_LABEL = 'About the codes in some condition names';
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(
    state => state.mr.conditions.updatedList,
  );
  const listState = useSelector(state => state.mr.conditions.listState);
  const conditions = useSelector(state => state.mr.conditions.conditionsList);
  const activeAlert = useAlerts(dispatch);
  const refresh = useSelector(state => state.mr.refresh);
  const conditionsCurrentAsOf = useSelector(
    state => state.mr.conditions.listCurrentAsOf,
  );

  const allowFilterSort = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort],
  );
  const [sortString, setSortString] = useState(
    SortTypes.ASC_DATE.labelWithDateEntered,
  );
  const [sortedConditions, setSortedConditions] = useState(conditions);

  useListRefresh({
    listState,
    listCurrentAsOf: conditionsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getConditionsList,
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
      updatePageTitle(pageTitles.HEALTH_CONDITIONS_PAGE_TITLE);
    },
    [dispatch],
  );

  const [selectedSort, setSelectedSort] = useState(
    allowFilterSort ? SortTypes.ASC_DATE.value : '',
  );

  useEffect(
    () => {
      switch (selectedSort) {
        case SortTypes.ALPHABETICAL.value:
          setSortString(SortTypes.ALPHABETICAL.label);
          break;
        case SortTypes.ASC_DATE.value:
          setSortString(SortTypes.ASC_DATE.labelWithDateEntered);
          break;
        case SortTypes.DSC_DATE.value:
          setSortString(SortTypes.DSC_DATE.labelWithDateEntered);
          break;
        default:
          break;
      }
    },
    [selectedSort],
  );

  useEffect(
    () => {
      switch (selectedSort) {
        case SortTypes.ALPHABETICAL.value:
          setSortedConditions(
            conditions?.sort((a, b) => {
              return a.name.localeCompare(b.name);
            }),
          );
          break;
        case SortTypes.ASC_DATE.value:
          setSortedConditions(
            conditions?.sort((a, b) => {
              return isBefore(new Date(a.date), new Date(b.date)) ? 1 : -1;
            }),
          );
          break;
        case SortTypes.DSC_DATE.value:
          setSortedConditions(
            conditions?.sort((a, b) => {
              return isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1;
            }),
          );
          break;
        default:
          break;
      }
    },
    [selectedSort, conditions],
  );

  return (
    <>
      <h1 className="vads-u-margin--0" data-testid="health-conditions">
        Health conditions
      </h1>

      <CernerFacilityAlert {...CernerAlertContent.HEALTH_CONDITIONS} />

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.HEALTH_CONDITIONS}
        recordCount={conditions?.length}
        recordType={recordType.HEALTH_CONDITIONS}
        listCurrentAsOf={conditionsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        <NewRecordsIndicator
          refreshState={refresh}
          extractType={refreshExtractTypes.VPR}
          newRecordsFound={
            Array.isArray(conditions) &&
            Array.isArray(updatedRecordList) &&
            conditions.length !== updatedRecordList.length
          }
          reloadFunction={() => {
            dispatch(reloadRecords());
          }}
        />

        <va-additional-info
          data-dd-action-name={ABOUT_THE_CODES_LABEL}
          trigger={ABOUT_THE_CODES_LABEL}
          class="no-print vads-u-margin-bottom--3"
        >
          <p>
            Some of your health conditions may have diagnosis codes in the name
            that start with SCT or ICD. Providers use these codes to track your
            health conditions and to communicate with other providers about your
            care. If you have a question about these codes or a health
            condition, ask your provider at your next appointment.
          </p>
        </va-additional-info>
        {allowFilterSort && (
          <SortRecordList
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            showDateEntered
          />
        )}
        <RecordList
          // DO NOT REMOVE MAP, COMPONENET WILL NOT RERENDER WITHOUT IT
          records={sortedConditions?.map(cond => cond)}
          type={recordType.HEALTH_CONDITIONS}
          sortedBy={sortString}
        />
      </RecordListSection>
    </>
  );
};

export default HealthConditions;
