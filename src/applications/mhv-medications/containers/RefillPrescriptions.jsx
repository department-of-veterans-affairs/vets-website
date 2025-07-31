import React, { useState, useEffect, useMemo } from 'react';
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
import {
  useGetRefillablePrescriptionsQuery,
  useBulkRefillPrescriptionsMutation,
} from '../api/prescriptionsApi';

import { dateFormat } from '../util/helpers';
import { selectRefillProgressFlag } from '../util/selectors';
import { SESSION_SELECTED_PAGE_NUMBER } from '../util/constants';
import RefillNotification from '../components/RefillPrescriptions/RefillNotification';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import PrintOnlyPage from './PrintOnlyPage';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import RefillAlert from '../components/shared/RefillAlert';
import NeedHelp from '../components/shared/NeedHelp';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import ProcessList from '../components/shared/ProcessList';
import { refillProcessStepGuide } from '../util/processListData';
import { useGetAllergiesQuery } from '../api/allergiesApi';

const RefillPrescriptions = () => {
  const {
    data: refillableData,
    isLoading,
    error: refillableError,
  } = useGetRefillablePrescriptionsQuery();

  const [
    bulkRefillPrescriptions,
    result,
  ] = useBulkRefillPrescriptionsMutation();
  const { isLoading: isRefilling, error: bulkRefillError } = result;

  const refillAlertList = refillableData?.refillAlertList || [];

  const getMedicationsByIds = (ids, prescriptions) => {
    if (!ids || !prescriptions) return [];
    return ids.map(id =>
      prescriptions.find(
        prescription => prescription.prescriptionId === Number(id),
      ),
    );
  };

  const successfulMeds = useMemo(
    () =>
      getMedicationsByIds(
        result?.data?.successfulIds,
        refillableData?.prescriptions,
      ),
    [result?.data?.successfulIds],
  );

  const failedMeds = useMemo(
    () =>
      getMedicationsByIds(
        result?.data?.failedIds,
        refillableData?.prescriptions,
      ),
    [result?.data?.failedIds],
  );

  const [hasNoOptionSelectedError, setHasNoOptionSelectedError] = useState(
    false,
  );
  const [selectedRefillList, setSelectedRefillList] = useState([]);
  const [refillStatus, setRefillStatus] = useState('notStarted');

  // Handle API errors from RTK Query
  const prescriptionsApiError = refillableError || bulkRefillError;

  // Selectors
  const selectedSortOption = useSelector(
    state => state.rx.preferences?.selectedSortOption,
  );

  // Get refillable list from RTK Query result
  const fullRefillList = refillableData?.prescriptions || [];
  const showRefillProgressContent = useSelector(selectRefillProgressFlag);
  const { data: allergies, error: allergiesError } = useGetAllergiesQuery();
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);

  // Memoized Values
  const selectedRefillListLength = useMemo(() => selectedRefillList.length, [
    selectedRefillList,
  ]);

  // Functions
  const onRequestRefills = async () => {
    if (selectedRefillListLength > 0) {
      setRefillStatus('inProgress');
      window.scrollTo(0, 0);

      // Get just the prescription IDs for the bulk refill
      const prescriptionIds = selectedRefillList.map(rx => rx.prescriptionId);

      try {
        await bulkRefillPrescriptions(prescriptionIds);
        setRefillStatus('finished');
      } catch (error) {
        setRefillStatus('error');
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
    setSelectedRefillList([]);
  };

  const onSelectPrescription = rx => {
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

  const content = () => {
    if (isLoading || isRefilling) {
      return (
        <div
          className="refill-loading-indicator"
          data-testid="loading-indicator"
        >
          <va-loading-indicator message="Loading medications..." set-focus />
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
        {showRefillProgressContent && (
          <RefillAlert
            dataDogActionName={dataDogActionNames.refillPage.REFILL_ALERT_LINK}
            refillStatus={refillStatus}
            refillAlertList={refillAlertList}
          />
        )}
        {prescriptionsApiError ? (
          <>
            <ApiErrorNotification errorType="access" content="medications" />
            <CernerFacilityAlert />
          </>
        ) : (
          <>
            <RefillNotification
              refillStatus={refillStatus}
              successfulMeds={successfulMeds}
              failedMeds={failedMeds}
            />
            {fullRefillList?.length > 0 ? (
              <div>
                <CernerFacilityAlert />
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
                      : 'Select at least one prescription to refill'
                  }
                >
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
                        onVaChange={() => onSelectPrescription(prescription)}
                        uswds
                        checkbox-description={`Prescription number: ${
                          prescription.prescriptionNumber
                        }
                        ${
                          prescription.sortedDispensedDate ||
                          prescription.dispensedDate
                            ? `Last filled on ${dateFormat(
                                prescription.sortedDispensedDate ||
                                  prescription.dispensedDate,
                                'MMMM D, YYYY',
                              )}`
                            : 'Not filled yet'
                        }
                        ${prescription.refillRemaining} refills left`}
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
                <p data-testid="no-refills-message">
                  You don’t have any VA prescriptions with refills available. If
                  you need a prescription, contact your care team.
                </p>
                <CernerFacilityAlert className="vads-u-margin-top--2" />
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
            {showRefillProgressContent && (
              <ProcessList stepGuideProps={stepGuideProps} />
            )}
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
