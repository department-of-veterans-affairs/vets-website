import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { updatePageTitle } from '../../shared/util/helpers';
import { dateFormat } from '../util/helpers';
import { getRefillablePrescriptionList, fillRxs } from '../api/rxApi';
import { selectRefillContentFlag } from '../util/selectors';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import RenewablePrescriptions from '../components/RefillPrescriptions/RenewablePrescriptions';

const RefillPrescriptions = ({ refillList = [], isLoadingList = true }) => {
  // Hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // State
  const [isLoading, updateLoadingStatus] = useState(isLoadingList);
  const [selectedRefillList, setSelectedRefillList] = useState([]);
  const [fullRefillList, setFullRefillList] = useState(refillList);

  // Selectors
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions?.selectedSortOption,
  );
  const showRefillContent = useSelector(selectRefillContentFlag);

  // Memoized Values
  const selectedRefillListLength = useMemo(() => selectedRefillList.length, [
    selectedRefillList,
  ]);
  const renewablePrescriptionsList = useMemo(
    () =>
      fullRefillList.filter(
        rx => rx.dispStatus === 'Active' && rx.refillRemaining === 0,
      ),
    [fullRefillList],
  );

  // Functions
  const onRequestRefills = () => {
    if (selectedRefillListLength > 0) {
      fillRxs(selectedRefillList);
    }
  };
  const onSelectPrescription = id => {
    if (!selectedRefillList.includes(id)) {
      setSelectedRefillList([...selectedRefillList, id]);
    } else {
      setSelectedRefillList(selectedRefillList.filter(item => item !== id));
    }
  };
  const onSelectAll = () => {
    if (selectedRefillListLength !== fullRefillList.length) {
      setSelectedRefillList(fullRefillList.map(p => p.prescriptionId));
    }
  };

  useEffect(
    () => {
      if (!fullRefillList) {
        updateLoadingStatus(true);
      }
      getRefillablePrescriptionList().then(({ data }) => {
        setFullRefillList(
          data
            .map(({ attributes }) => attributes)
            .sort((a, b) =>
              a.prescriptionName.localeCompare(b.prescriptionName),
            ),
        );
        updateLoadingStatus(false);
      });
      dispatch(
        setBreadcrumbs(
          [
            {
              url: `/my-health/medications/1`,
              label: 'Medications',
            },
          ],
          {
            url: `/my-health/medications/refill/`,
            label: 'Refill',
          },
        ),
      );
      updatePageTitle('Refill prescriptions - Medications | Veterans Affairs');
    },
    // disabled warning: fullRefillList must be left of out dependency array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, location.pathname, selectedSortOption],
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
        <span className="refill-back-arrow">
          <Link
            data-testid="back-to-medications-page-link"
            to="/"
            className="refill-back-link"
          >
            Back to Medications
          </Link>
        </span>
        <div>
          <h1
            className="vads-u-margin-top--neg1 vads-u-margin-bottom--4"
            data-testid="refill-page-title"
          >
            Refill prescriptions
          </h1>
          <h2
            className="vads-u-margin-top--3"
            data-testid="refill-page-subtitle"
          >
            Ready to refill
          </h2>
          <p
            className="vads-u-margin-y--3"
            data-testid="refill-page-list-count"
          >
            You have {fullRefillList.length}{' '}
            {`prescription${fullRefillList.length !== 1 ? 's' : ''}`} ready to
            refill.
          </p>
          <VaButton
            secondary
            uswds
            type="button"
            style={{ fontWeight: 'bold' }}
            className="vads-u-font-weight--bold vads-u-background-color--white vads-u-margin-bottom--3 vads-u-margin-x--0 vads-u-padding--0"
            id="select-all-button"
            aria-describedby="select-all-button"
            data-testid="select-all-button"
            onClick={() => onSelectAll()}
            text="Select all"
          />
          <div>
            {fullRefillList
              .slice()
              .filter(rx => rx.refillRemaining > 0)
              .map((prescription, idx) => (
                <div key={idx} className="vads-u-margin-bottom--2">
                  <input
                    data-testid={`refill-prescription-checkbox-${idx}`}
                    type="checkbox"
                    checked={
                      selectedRefillList.includes(
                        prescription.prescriptionId,
                      ) || false
                    }
                    id={prescription.prescriptionId}
                    name={prescription.prescriptionId}
                    className="vads-u-margin-y--0"
                    onChange={e =>
                      e.type === 'change' &&
                      onSelectPrescription(prescription.prescriptionId)
                    }
                  />
                  <label
                    htmlFor={prescription.id}
                    className="vads-u-margin-y--0"
                  >
                    <h4 className="vads-u-display--inline-block vads-u-margin-y--0">
                      {prescription.prescriptionName}
                    </h4>
                  </label>
                  <p
                    className="vads-u-margin-left--4 vads-u-margin-top--0"
                    data-testid={`refill-prescription-details-${
                      prescription.prescriptionNumber
                    }`}
                  >
                    Prescription number: {prescription.prescriptionNumber}
                    <br />
                    <span data-testid={`refill-last-filled-${idx}`}>
                      Last filled on{' '}
                      {dateFormat(
                        prescription.rxRfRecords?.[0]?.[1]?.find(
                          record => record.dispensedDate,
                        )?.dispensedDate || prescription.dispensedDate,
                        'MMMM D, YYYY',
                      )}
                    </span>
                    <br />
                    {prescription.refillRemaining} refills left
                  </p>
                </div>
              ))}
          </div>
          <VaButton
            uswds
            type="button"
            className="vads-u-background-color--white vads-u-padding--0 vads-u-margin-top--1"
            id="request-refill-button"
            aria-describedby="request-refill-button"
            data-testid="request-refill-button"
            onClick={() => onRequestRefills()}
            text={`Request refill${selectedRefillListLength !== 1 ? 's' : ''}`}
          />
        </div>
        <RenewablePrescriptions
          renewablePrescriptionsList={renewablePrescriptionsList}
        />
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
