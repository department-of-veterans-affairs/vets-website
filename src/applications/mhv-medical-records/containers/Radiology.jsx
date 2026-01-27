import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { selectHoldTimeMessagingUpdate } from '../util/selectors';
import { Actions } from '../util/actionTypes';
import RecordList from '../components/RecordList/RecordList';
import { getRadiologyList, reloadRadiologyRecords } from '../actions/radiology';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  labTypes,
  pageTitles,
  recordType,
  refreshExtractTypes,
  studyJobStatus,
  loadStates,
  statsdFrontEndActions,
} from '../util/constants';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import HoldTimeInfo from '../components/shared/HoldTimeInfo';
import { fetchImageRequestStatus } from '../actions/images';
import JobCompleteAlert from '../components/shared/JobsCompleteAlert';
import { useTrackAction } from '../hooks/useTrackAction';
import TrackedSpinner from '../components/shared/TrackedSpinner';

const Radiology = () => {
  const dispatch = useDispatch();

  const updatedRecordList = useSelector(
    state => state.mr.radiology.updatedList,
  );
  const radiologyList = useSelector(state => state.mr.radiology.radiologyList);
  const { imageStatus: studyJobs } = useSelector(state => state.mr.images);
  const holdTimeMessagingUpdate = useSelector(selectHoldTimeMessagingUpdate);

  const radRecordsWithImagesReady = radiologyList?.filter(radRecord => {
    const isRadRecord =
      radRecord?.type === labTypes.RADIOLOGY ||
      radRecord?.type === labTypes.CVIX_RADIOLOGY;
    const studyJob =
      studyJobs?.find(img => img.studyIdUrn === radRecord.studyId) || null;
    const jobComplete = studyJob?.status === studyJobStatus.COMPLETE;
    return isRadRecord && jobComplete;
  });

  const activeAlert = useAlerts(dispatch);
  const listState = useSelector(state => state.mr.radiology.listState);
  const refresh = useSelector(state => state.mr.refresh);
  const radiologyCurrentAsOf = useSelector(
    state => state.mr.radiology.listCurrentAsOf,
  );

  useTrackAction(statsdFrontEndActions.IMAGING_RESULTS_LIST);

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
    },
    [dispatch],
  );

  const dispatchAction = useMemo(() => {
    return isCurrent => {
      return getRadiologyList(isCurrent);
    };
  }, []);

  useListRefresh({
    listState,
    listCurrentAsOf: radiologyCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.IMAGING,
    dispatchAction,
    dispatch,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.Radiology.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRadiologyRecords,
  });

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.RADIOLOGY_PAGE_TITLE);
    },
    [dispatch],
  );

  const isLoading = listState === loadStates.FETCHING;

  return (
    <div id="radiology">
      <h1 className="page-title vads-u-margin-bottom--1">Radiology</h1>

      {holdTimeMessagingUpdate && <HoldTimeInfo locationPhrase="here" />}
      {!holdTimeMessagingUpdate && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Review reports from your VA imaging tests like X-rays, MRIs, and CT
          scans. Request and download your radiology images.
        </p>
      )}

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.RADIOLOGY}
        recordCount={radiologyList?.length}
        recordType={recordType.RADIOLOGY}
        listCurrentAsOf={radiologyCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        <NewRecordsIndicator
          refreshState={refresh}
          extractType={refreshExtractTypes.IMAGING}
          newRecordsFound={
            Array.isArray(radiologyList) &&
            Array.isArray(updatedRecordList) &&
            radiologyList.length !== updatedRecordList.length
          }
          reloadFunction={() => {
            dispatch(reloadRadiologyRecords());
          }}
        />
        {isLoading && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="radiology-page-spinner"
              message="We're loading your records."
              setFocus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoading &&
          radiologyList !== undefined && (
            <>
              {radiologyList?.length ? (
                <>
                  {radRecordsWithImagesReady?.length > 0 &&
                    studyJobs?.length > 0 && (
                      <VaAlert
                        status="success"
                        visible
                        class="vads-u-margin-y--3 no-print"
                        role="alert"
                        data-testid="alert-images-ready"
                      >
                        <h3
                          slot="headline"
                          className="vads-u-font-size--lg no-print"
                        >
                          Images ready
                        </h3>
                        <JobCompleteAlert
                          records={radRecordsWithImagesReady}
                          studyJobs={studyJobs}
                          basePath="/imaging-results"
                        />
                      </VaAlert>
                    )}

                  <RecordList
                    type={recordType.RADIOLOGY}
                    records={radiologyList}
                  />
                </>
              ) : (
                <div className="vads-u-margin-y--8">
                  <va-alert
                    close-btn-aria-label="Close notification"
                    status="info"
                    visible
                  >
                    <h2 slot="headline">No radiology records</h2>
                    <p className="vads-u-margin-bottom--0">
                      You don’t have any radiology records in your VA medical
                      records.
                    </p>
                  </va-alert>
                </div>
              )}
            </>
          )}
      </RecordListSection>
    </div>
  );
};

export default Radiology;
