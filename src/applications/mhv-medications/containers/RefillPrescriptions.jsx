import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import {
  VaButton,
  VaCheckbox,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  updatePageTitle,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import useAcceleratedData from '~/platform/mhv/hooks/useAcceleratedData';
import CernerFacilityAlert from '~/platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
import {
  useGetRefillablePrescriptionsQuery,
  useBulkRefillPrescriptionsMutation,
} from '../api/prescriptionsApi';

import { dateFormat } from '../util/helpers';
import {
  DATETIME_FORMATS,
  SESSION_SELECTED_PAGE_NUMBER,
  REFILL_STATUS,
  REFILL_LOADING_MESSAGES,
  REFILL_ERROR_MESSAGES,
} from '../util/constants';
import RefillNotification from '../components/RefillPrescriptions/RefillNotification';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import PrintOnlyPage from './PrintOnlyPage';
import DelayedRefillAlert from '../components/shared/DelayedRefillAlert';
import NeedHelp from '../components/shared/NeedHelp';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import ProcessList from '../components/shared/ProcessList';
import { refillProcessStepGuide } from '../util/processListData';
import { useGetAllergiesQuery } from '../api/allergiesApi';
import {
  selectUserDob,
  selectUserFullName,
  selectOracleHealthMigrations,
} from '../selectors/selectUser';
import {
  selectCernerPilotFlag,
  selectMhvMedicationsOracleHealthCutoverFlag,
} from '../util/selectors';
import { OracleHealthT3Alert } from '../components/OracleHealthTransitionAlerts';
import { filterPrescriptionsByTransition } from '../util/oracleHealthTransition';

import { selectSortOption } from '../selectors/selectPreferences';

const RefillPrescriptions = () => {
  const {
    data: refillableData,
    isLoading,
    isFetching,
    error: refillableError,
  } = useGetRefillablePrescriptionsQuery();

  const isCernerPilot = useSelector(selectCernerPilotFlag);

  const [bulkRefillPrescriptions, result] = useBulkRefillPrescriptionsMutation({
    fixedCacheKey: 'bulk-refill-request',
  });
  const {
    isLoading: isRefilling,
    error: bulkRefillError,
    isSuccess: refillRequestSuccess,
  } = result;

  const refillAlertList = refillableData?.refillAlertList || [];

  const getMedicationsByIds = useCallback((ids, prescriptions) => {
    if (!ids || !prescriptions) return [];

    return ids
      .map(id => {
        const prescriptionId = id?.id ?? id;
        const stationNumber = id?.stationNumber ?? null;

        return prescriptions.find(prescription => {
          const idMatch =
            String(prescription.prescriptionId) === String(prescriptionId);

          if (stationNumber) {
            return idMatch && prescription.stationNumber === stationNumber;
          }
          return idMatch;
        });
      })
      .filter(Boolean);
  }, []);

  // Ref to snapshot the selected prescriptions at refill time
  const submittedMedications = useRef(null);

  const successfulMeds = useMemo(
    () =>
      getMedicationsByIds(
        result?.data?.successfulIds,
        submittedMedications.current || refillableData?.prescriptions,
      ),
    [
      getMedicationsByIds,
      result?.data?.successfulIds,
      refillableData?.prescriptions,
    ],
  );

  const failedMeds = useMemo(
    () =>
      getMedicationsByIds(
        result?.data?.failedIds,
        submittedMedications.current || refillableData?.prescriptions,
      ),
    [
      getMedicationsByIds,
      result?.data?.failedIds,
      refillableData?.prescriptions,
    ],
  );

  const [hasNoOptionSelectedError, setHasNoOptionSelectedError] = useState(
    false,
  );
  const [selectedRefillList, setSelectedRefillList] = useState([]);
  const [refillStatus, setRefillStatus] = useState(REFILL_STATUS.NOT_STARTED);

  // Compute the actual refill status based on RTK Query state to prevent race conditions
  const refillRequestStatus = useMemo(
    () => {
      if (isRefilling) {
        return REFILL_STATUS.IN_PROGRESS;
      }
      if (refillRequestSuccess && result?.data) {
        return REFILL_STATUS.FINISHED;
      }
      if (bulkRefillError) {
        return REFILL_STATUS.ERROR;
      }
      return refillStatus; // Fallback to manual status for initial state
    },
    [
      isRefilling,
      refillRequestSuccess,
      result?.data,
      bulkRefillError,
      refillStatus,
    ],
  );

  // Handle API errors from RTK Query
  const prescriptionsApiError = refillableError || bulkRefillError;

  // Selectors
  const selectedSortOption = useSelector(selectSortOption);
  const {
    isAcceleratingAllergies,
    isCerner,
    isLoading: isAcceleratedDataLoading,
  } = useAcceleratedData();

  const migratingFacilities = useSelector(selectOracleHealthMigrations);
  const isOracleHealthCutoverEnabled = useSelector(
    selectMhvMedicationsOracleHealthCutoverFlag,
  );

  const isDataLoading = isLoading || isRefilling;
  const selectedRefillListLength = selectedRefillList.length;

  // Prevent interactions during cache refresh to avoid duplicate refill attempts
  const isRefreshing =
    refillRequestStatus === REFILL_STATUS.FINISHED && isFetching;
  const isDisabled = isDataLoading || isRefreshing;

  // Clear the submitted meds snapshot after cache refresh completes or error
  useEffect(
    () => {
      if (refillRequestStatus === REFILL_STATUS.FINISHED && !isFetching) {
        submittedMedications.current = null;
      }
      if (refillRequestStatus === REFILL_STATUS.ERROR) {
        submittedMedications.current = null;
      }
    },
    [refillRequestStatus, isFetching],
  );

  // Use the original refillable prescriptions list without client-side filtering
  // This prevents duplicate refill attempts by relying on server-side data consistency
  // Cache invalidation in the API (invalidatesTags) will handle removing refilled prescriptions
  const {
    available: availablePrescriptions,
    blocked: blockedPrescriptions,
  } = useMemo(
    () =>
      filterPrescriptionsByTransition({
        prescriptions: refillableData?.prescriptions,
        isFeatureFlagEnabled: isOracleHealthCutoverEnabled,
        migrations: migratingFacilities,
      }),
    [
      refillableData?.prescriptions,
      isOracleHealthCutoverEnabled,
      migratingFacilities,
    ],
  );

  const fullRefillList = useMemo(() => availablePrescriptions || [], [
    availablePrescriptions,
  ]);

  // Hide the refillable list during cache refresh after successful refill to prevent duplicate attempts
  const hideList = isRefreshing;

  const { data: allergies, error: allergiesError } = useGetAllergiesQuery(
    {
      isAcceleratingAllergies,
      isCerner,
    },
    {
      skip: isAcceleratedDataLoading, // Wait for Cerner data and toggles to load before calling API
    },
  );
  const userName = useSelector(selectUserFullName);
  const dob = useSelector(selectUserDob);

  // Functions
  const onRequestRefills = async () => {
    if (selectedRefillListLength > 0) {
      setRefillStatus(REFILL_STATUS.IN_PROGRESS);
      window.scrollTo(0, 0);

      submittedMedications.current = selectedRefillList;

      // Get just the prescription IDs for the bulk refill
      const prescriptionIds = selectedRefillList.map(rx => {
        if (isCernerPilot) {
          return { id: rx.prescriptionId, stationNumber: rx.stationNumber };
        }
        return rx.prescriptionId;
      });

      try {
        await bulkRefillPrescriptions(prescriptionIds).unwrap();
        setRefillStatus(REFILL_STATUS.FINISHED);
        setSelectedRefillList([]);
      } catch (error) {
        setRefillStatus(REFILL_STATUS.ERROR);
      }

      if (hasNoOptionSelectedError) setHasNoOptionSelectedError(false);
    } else {
      setHasNoOptionSelectedError(true);
      focusElement(
        document.getElementById(
          fullRefillList?.length > 1
            ? 'select-all-checkbox'
            : `checkbox-${fullRefillList[0].prescriptionId}`,
        ),
      );
    }
  };

  const onSelectPrescription = rx => {
    if (isDisabled) return;

    if (
      !selectedRefillList.find(
        item => item.prescriptionId === rx.prescriptionId,
      )
    ) {
      if (hasNoOptionSelectedError) {
        setHasNoOptionSelectedError(false);
      }
      setSelectedRefillList([...selectedRefillList, rx]);
    } else {
      setSelectedRefillList(
        selectedRefillList.filter(
          item => item.prescriptionId !== rx.prescriptionId,
        ),
      );
    }
  };

  const onSelectAll = event => {
    if (isDisabled) return;

    if (
      event.detail.checked &&
      selectedRefillListLength !== fullRefillList.length
    ) {
      if (hasNoOptionSelectedError) {
        setHasNoOptionSelectedError(false);
      }
      setSelectedRefillList(fullRefillList);
    } else if (!event.detail.checked) {
      setSelectedRefillList([]);
    }
  };

  useEffect(
    () => {
      // Remove session data on component mount
      sessionStorage.removeItem(SESSION_SELECTED_PAGE_NUMBER);

      updatePageTitle('Refill prescriptions - Medications | Veterans Affairs');
    },
    [selectedSortOption],
  );

  useEffect(
    () => {
      if (!isLoading && !isRefilling) {
        focusElement(document.querySelector('h1'));
      }
    },
    [isLoading, isRefilling],
  );

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, updatePageTitle);

  const getCheckboxDescription = prescription => {
    let lastFilledText = '';
    if (prescription.sortedDispensedDate || prescription.dispensedDate) {
      lastFilledText = `Last filled on ${dateFormat(
        prescription.sortedDispensedDate || prescription.dispensedDate,
        DATETIME_FORMATS.longMonthDate,
      )}`;
    } else if (!isCernerPilot) {
      lastFilledText = 'Not filled yet';
    }
    const descriptionLines = [
      `Prescription number: ${prescription.prescriptionNumber}`,
    ];
    if (lastFilledText) {
      descriptionLines.push(lastFilledText);
    }
    descriptionLines.push(`${prescription.refillRemaining} refills left`);
    return descriptionLines.join('\n');
  };

  const content = () => {
    if (isDataLoading || hideList) {
      return (
        <div
          className="refill-loading-indicator"
          data-testid="loading-indicator"
        >
          <va-loading-indicator
            message={
              hideList
                ? REFILL_LOADING_MESSAGES.UPDATING_REFILL_LIST
                : REFILL_LOADING_MESSAGES.LOADING
            }
            set-focus
          />
        </div>
      );
    }
    const stepGuideProps = {
      processSteps: refillProcessStepGuide.processSteps,
      title: refillProcessStepGuide.title,
    };
    return (
      <div>
        <h1
          className="vads-u-margin-top--neg1 vads-u-margin-bottom--4"
          data-testid="refill-page-title"
        >
          Refill prescriptions
        </h1>
        {refillAlertList.length > 0 && (
          <DelayedRefillAlert
            dataDogActionName={dataDogActionNames.refillPage.REFILL_ALERT_LINK}
            refillAlertList={refillAlertList}
          />
        )}
        {prescriptionsApiError ? (
          <>
            <ApiErrorNotification errorType="access" content="medications" />
            <CernerFacilityAlert
              healthTool="MEDICATIONS"
              apiError={prescriptionsApiError}
            />
          </>
        ) : (
          <>
            <RefillNotification
              refillStatus={refillRequestStatus}
              successfulMeds={successfulMeds}
              failedMeds={failedMeds}
              isFetching={isFetching}
            />
            {fullRefillList?.length > 0 ? (
              <div>
                {blockedPrescriptions?.length > 0 && (
                  <OracleHealthT3Alert
                    blockedPrescriptions={blockedPrescriptions}
                    hasRefillable={fullRefillList?.length > 0}
                    migratingFacilities={migratingFacilities}
                  />
                )}
                {isOracleHealthCutoverEnabled && (
                  <CernerFacilityAlert healthTool="MEDICATIONS_REFILL" />
                )}
                <h2
                  className="vads-u-margin-top--3"
                  data-testid="refill-page-subtitle"
                >
                  Ready to refill
                </h2>
                <VaCheckboxGroup
                  data-testid="refill-checkbox-group"
                  label={`You have ${fullRefillList.length} prescription${
                    fullRefillList.length !== 1 ? 's' : ''
                  } ready to refill.`}
                  class="vads-u-margin-bottom--2 tablet:vads-u-margin-bottom--2p5"
                  error={
                    !hasNoOptionSelectedError
                      ? ''
                      : REFILL_ERROR_MESSAGES.NO_PRESCRIPTIONS_SELECTED
                  }
                >
                  <div className="vads-u-margin-top--2" />
                  {fullRefillList?.length > 1 && (
                    <VaCheckbox
                      id="select-all-checkbox"
                      data-testid="select-all-checkbox"
                      label={`Select all ${fullRefillList.length} refills`}
                      name="select-all-checkbox"
                      className="vads-u-margin-bottom--3 select-all-checkbox no-print"
                      data-dd-action-name={
                        dataDogActionNames.refillPage.SELECT_ALL_CHECKBOXES
                      }
                      checked={
                        selectedRefillListLength === fullRefillList.length
                      }
                      disabled={isDisabled}
                      onVaChange={onSelectAll}
                      uswds
                    />
                  )}
                  {fullRefillList.slice().map((prescription, idx) => (
                    <div key={idx} className="vads-u-margin-bottom--2">
                      <VaCheckbox
                        id={`checkbox-${prescription.prescriptionId}`}
                        data-testid={`refill-prescription-checkbox-${idx}`}
                        label={prescription.prescriptionName}
                        name={prescription.prescriptionId}
                        className="select-1-checkbox vads-u-margin-y--0"
                        data-dd-action-name={
                          dataDogActionNames.refillPage
                            .SELECT_SINGLE_MEDICATION_CHECKBOX
                        }
                        data-dd-privacy="mask"
                        checked={
                          selectedRefillList.find(
                            item =>
                              item.prescriptionId ===
                              prescription.prescriptionId,
                          ) || false
                        }
                        disabled={isDisabled}
                        onVaChange={() => onSelectPrescription(prescription)}
                        uswds
                        checkbox-description={getCheckboxDescription(
                          prescription,
                        )}
                      />
                    </div>
                  ))}
                </VaCheckboxGroup>
                <VaButton
                  uswds
                  type="button"
                  className="vads-u-background-color--white vads-u-padding--0 vads-u-margin-top--1 no-print"
                  id="request-refill-button"
                  data-testid="request-refill-button"
                  data-dd-action-name={
                    dataDogActionNames.refillPage.REQUEST_REFILLS_BUTTON
                  }
                  disabled={isDisabled}
                  onClick={() => onRequestRefills()}
                  text={`Request ${
                    selectedRefillListLength > 0 ? selectedRefillListLength : ''
                  } refill${
                    selectedRefillListLength === 1 ||
                    fullRefillList.length === 1
                      ? ''
                      : 's'
                  }`}
                />
              </div>
            ) : (
              <>
                {blockedPrescriptions?.length > 0 && (
                  <OracleHealthT3Alert
                    blockedPrescriptions={blockedPrescriptions}
                    hasRefillable={false}
                    migratingFacilities={migratingFacilities}
                  />
                )}
                <p data-testid="no-refills-message">
                  You don’t  have any VA prescriptions with refills available. If
                  you need a prescription, contact your care team.
                </p>
                {isOracleHealthCutoverEnabled && (
                  <CernerFacilityAlert
                    healthTool="MEDICATIONS_REFILL"
                    className="vads-u-margin-top--2"
                  />
                )}
              </>
            )}
            <p className="vads-u-margin-top--3" data-testid="note-refill-page">
              <strong>Note:</strong> If you can’t find the prescription you’re
              looking for, you may need to renew it. Go to your medications list
              and filter by “renewal needed before refill.”
              <Link
                data-testid="medications-page-link"
                className="vads-u-margin-top--2 vads-u-display--block"
                to="/"
                data-dd-action-name={
                  dataDogActionNames.refillPage
                    .GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK_RENEW
                }
              >
                Go to your medications list
              </Link>
            </p>
            <ProcessList stepGuideProps={stepGuideProps} />
            <NeedHelp page={pageType.REFILL} />
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div>
        <div
          className={
            !prescriptionsApiError && !allergiesError ? '' : 'no-print'
          }
        >
          {content()}
          <hr className="vads-u-margin-y--3 print-only" />
          <AllergiesPrintOnly allergies={allergies} />
        </div>
        {(prescriptionsApiError || allergiesError) && (
          <PrintOnlyPage title="Refill prescriptions" hasError />
        )}
      </div>
    </>
  );
};

export default RefillPrescriptions;
