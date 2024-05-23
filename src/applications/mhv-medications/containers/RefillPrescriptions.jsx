import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  VaButton,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  getRefillablePrescriptionsList,
  getAllergiesList,
} from '../actions/prescriptions';
import { dateFormat } from '../util/helpers';
import { fillRxs } from '../api/rxApi';
import { selectRefillContentFlag } from '../util/selectors';
import RenewablePrescriptions from '../components/RefillPrescriptions/RenewablePrescriptions';
import { dispStatusObj, DD_ACTIONS_PAGE_TYPE } from '../util/constants';
import RefillNotification from '../components/RefillPrescriptions/RefillNotification';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';

const RefillPrescriptions = ({ refillList = [], isLoadingList = true }) => {
  // Hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // State
  const [isLoading, updateLoadingStatus] = useState(isLoadingList);
  const [hasNoOptionSelectedError, setHasNoOptionSelectedError] = useState(
    false,
  );
  const [selectedRefillList, setSelectedRefillList] = useState([]);
  const [fullRefillList, setFullRefillList] = useState(refillList);
  const [fullRenewList, setFullRenewList] = useState(refillList);
  const [refillResult, setRefillResult] = useState({
    status: 'notStarted',
    failedMeds: [],
    successfulMeds: [],
  });

  // Selectors
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions?.selectedSortOption,
  );
  const refillablePrescriptionsList = useSelector(
    state => state.rx.prescriptions?.refillablePrescriptionsList,
  );
  const prescriptionsApiError = useSelector(
    state => state.rx.prescriptions?.apiError,
  );
  const showRefillContent = useSelector(selectRefillContentFlag);
  const allergies = useSelector(state => state.rx.allergies?.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);

  // Memoized Values
  const selectedRefillListLength = useMemo(() => selectedRefillList.length, [
    selectedRefillList,
  ]);

  // Functions
  const onRequestRefills = async () => {
    if (selectedRefillListLength > 0) {
      setRefillResult({ ...refillResult, status: 'inProgress' });
      updateLoadingStatus(true);
      window.scrollTo(0, 0);
      const response = await fillRxs(selectedRefillList);
      const failedIds = response?.failedIds || [];
      const successfulIds = response?.successfulIds || [];
      const failedMeds = fullRefillList.filter(item =>
        failedIds.includes(String(item.prescriptionId)),
      );
      const successfulMeds = fullRefillList.filter(item =>
        successfulIds.includes(String(item.prescriptionId)),
      );
      setRefillResult({
        status: 'finished',
        failedMeds,
        successfulMeds,
      });
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

  const onSelectPrescription = id => {
    if (!selectedRefillList.includes(id)) {
      setSelectedRefillList([...selectedRefillList, id]);
    } else {
      setSelectedRefillList(selectedRefillList.filter(item => item !== id));
    }
  };

  const onSelectAll = event => {
    if (
      event.detail.checked &&
      selectedRefillListLength !== fullRefillList.length
    ) {
      setSelectedRefillList(fullRefillList.map(p => p.prescriptionId));
    } else if (!event.detail.checked) {
      setSelectedRefillList([]);
    }
  };

  const categorizePrescriptions = ([refillable, renewable], rx) => {
    if (
      (rx.dispStatus === dispStatusObj.active && rx.refillRemaining > 0) ||
      (rx.dispStatus === dispStatusObj.activeParked &&
        (rx.refillRemaining > 0 || rx.rxRfRecords.length === 0))
    ) {
      return [[...refillable, rx], renewable];
    }
    return [refillable, [...renewable, rx]];
  };

  useEffect(
    () => {
      if (fullRefillList === undefined || fullRefillList.length === 0) {
        updateLoadingStatus(true);
      }
      if (refillResult.status !== 'inProgress') {
        dispatch(getRefillablePrescriptionsList()).then(() =>
          updateLoadingStatus(false),
        );
        if (!allergies) dispatch(getAllergiesList());
      }
      updatePageTitle('Refill prescriptions - Medications | Veterans Affairs');
    },
    // disabled warning: fullRefillList must be left of out dependency array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, location.pathname, selectedSortOption, refillResult, allergies],
  );

  useEffect(
    () => {
      if (!isLoading) {
        focusElement(document.querySelector('h1'));
      }
    },
    [isLoading],
  );

  useEffect(
    () => {
      if (refillablePrescriptionsList) {
        const fullList = refillablePrescriptionsList.sort((a, b) =>
          a.prescriptionName.localeCompare(b.prescriptionName),
        );
        const [refillableList, renewableList] = fullList.reduce(
          categorizePrescriptions,
          [[], []],
        );
        setFullRefillList(refillableList);
        setFullRenewList(renewableList);
      }
      // disabled warning: fullRefillList must be left of out dependency array to avoid infinite loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [refillablePrescriptionsList],
  );

  const content = () => {
    if (!showRefillContent) {
      return <PageNotFound />;
    }
    if (isLoading) {
      return (
        <div className="refill-loading-indicator">
          <va-loading-indicator message="Loading medications..." setFocus />
        </div>
      );
    }
    return (
      <div>
        <h1
          className="vads-u-margin-top--neg1 vads-u-margin-bottom--4"
          data-testid="refill-page-title"
        >
          Refill prescriptions
        </h1>
        {prescriptionsApiError ? (
          <ApiErrorNotification />
        ) : (
          <>
            {fullRefillList?.length > 0 ? (
              <div>
                <RefillNotification refillResult={refillResult} />
                <h2
                  className="vads-u-margin-top--3"
                  data-testid="refill-page-subtitle"
                >
                  Ready to refill
                </h2>
                <p
                  className={`vads-u-margin-top--3 vads-u-margin-bottom--${
                    !hasNoOptionSelectedError ? '3' : '2'
                  }`}
                  data-testid="refill-page-list-count"
                  id="refill-page-list-count"
                >
                  You have {fullRefillList.length}{' '}
                  {`prescription${fullRefillList.length !== 1 ? 's' : ''}`}{' '}
                  ready to refill.
                </p>
                <p
                  id="select-one-rx-error"
                  data-testid="select-one-rx-error"
                  className={`vads-u-color--secondary vads-u-font-weight--bold rx-refill-submit-error-${
                    !hasNoOptionSelectedError ? 'hidden' : 'visible'
                  }`}
                  role="alert"
                >
                  <span className="usa-sr-only">Error</span>
                  <span
                    className="usa-error-message"
                    data-testid="select-rx-error-message"
                  >
                    Select at least one prescription to refill
                  </span>
                </p>
                {fullRefillList?.length > 1 && (
                  <VaCheckbox
                    id="select-all-checkbox"
                    data-testid="select-all-checkbox"
                    label={`Select all ${fullRefillList.length} refills`}
                    name="select-all-checkbox"
                    className="vads-u-margin-bottom--3 select-all-checkbox"
                    data-dd-action-name={`Select All Checkbox - ${
                      DD_ACTIONS_PAGE_TYPE.REFILL
                    }`}
                    checked={selectedRefillListLength === fullRefillList.length}
                    onVaChange={onSelectAll}
                    uswds
                  />
                )}
                {fullRefillList.slice().map((prescription, idx) => (
                  <div key={idx} className="vads-u-margin-bottom--2">
                    <input
                      data-dd-action-name={`Select Single Medication Checkbox - ${
                        DD_ACTIONS_PAGE_TYPE.REFILL
                      }`}
                      data-testid={`refill-prescription-checkbox-${idx}`}
                      type="checkbox"
                      checked={
                        selectedRefillList.includes(
                          prescription.prescriptionId,
                        ) || false
                      }
                      id={`checkbox-${prescription.prescriptionId}`}
                      name={prescription.prescriptionId}
                      className="vads-u-margin-y--0"
                      onChange={e =>
                        e.type === 'change' &&
                        onSelectPrescription(prescription.prescriptionId)
                      }
                    />
                    <label
                      htmlFor={`checkbox-${prescription.prescriptionId}`}
                      id={`label-${prescription.prescriptionId}`}
                      className="refillable-prescription-item"
                    >
                      <div>
                        <span className="vads-u-margin-y--0 vads-u-font-size--h4 vads-u-font-family--serif vads-u-font-weight--bold">
                          {prescription.prescriptionName}
                        </span>
                        <div
                          id={`details-${prescription.prescriptionId}`}
                          className="vads-u-margin-top--0"
                          data-testid={`refill-prescription-details-${
                            prescription.prescriptionNumber
                          }`}
                        >
                          <p className="vads-u-margin--0">
                            Prescription number:{' '}
                            {prescription.prescriptionNumber}
                          </p>
                          <p
                            className="vads-u-margin--0"
                            data-testid={`refill-last-filled-${idx}`}
                          >
                            Last filled on{' '}
                            {dateFormat(
                              prescription.sortedDispensedDate ||
                                prescription.dispensedDate,
                              'MMMM D, YYYY',
                            )}
                          </p>
                          <p className="vads-u-margin--0">
                            {prescription.refillRemaining} refills left
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
                <VaButton
                  uswds
                  type="button"
                  className="vads-u-background-color--white vads-u-padding--0 vads-u-margin-top--1"
                  id="request-refill-button"
                  data-testid="request-refill-button"
                  data-dd-action-name={`Request Refills Button - ${
                    DD_ACTIONS_PAGE_TYPE.REFILL
                  }`}
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
              <p data-testid="no-refills-message">
                You don’t have any VA prescriptions with refills available. If
                you need a prescription, contact your care team.
              </p>
            )}
            <RenewablePrescriptions
              renewablePrescriptionsList={fullRenewList}
            />
            <div className="print-only">
              <AllergiesPrintOnly
                allergies={allergies}
                allergiesError={allergiesError}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return <>{content()}</>;
};

// These have been added for testing purposes only
// While the list and loading status is being determined locally
RefillPrescriptions.propTypes = {
  isLoadingList: PropTypes.bool,
  refillList: PropTypes.array,
};

export default RefillPrescriptions;
