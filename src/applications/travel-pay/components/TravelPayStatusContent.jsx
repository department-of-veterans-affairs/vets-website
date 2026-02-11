import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VaBackToTop } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import { HelpTextGeneral, HelpTextManage } from './HelpText';
import { getTravelClaims } from '../redux/actions';
import { getDateFilters } from '../util/dates';
import { BTSSS_PORTAL_URL } from '../constants';
import TravelPayStatusList from './TravelPayStatusList';
import TravelPayDateRangeSelect from './TravelPayDateRangeSelect';

function SmocEntryContent({ complexClaimsEnabled }) {
  return (
    <>
      <p className="vads-u-font-family--serif vads-u-font-size--lg">
        File new claims for travel reimbursement and review the status of all
        your travel claims.
      </p>
      <h2 className="vads-u-margin-top--2">
        {complexClaimsEnabled
          ? 'File a new claim for travel pay online'
          : 'File a new claim for travel reimbursement online'}
      </h2>
      {complexClaimsEnabled ? (
        <>
          <p>
            Go to your list of past appointments to file a travel reimbursement
            claim for eligible appointments.
          </p>
          <va-link-action
            href="/my-health/appointments/past"
            text="Go to your past appointments"
            class="vads-u-margin-y--1"
          />
          <p>
            You'll need to use the Beneficiary Travel Self Service System
            (BTSSS) if any of these things are true:
          </p>
          <ul>
            <li>You don't see your appointment in your appointments list</li>
            <li>Your travel was one way</li>
            <li>
              Your travel started from an address other than the one we have on
              file
            </li>
          </ul>
          <va-link
            external
            href={BTSSS_PORTAL_URL}
            text="Go to the BTSSS website"
          />
          <p>
            <strong>Note:</strong> You can continue saved or incomplete claims
            by selecting Travel reimbursement claim details.
          </p>
        </>
      ) : (
        <>
          <p>
            If you're claiming mileage only, you can file a travel claim for
            eligible past appointments here on VA.gov.
          </p>
          <va-link-action
            href="/my-health/appointments/past"
            text="Go to your past appointments"
            class="vads-u-margin-y--1"
          />
          <p>
            <strong>
              If you need to submit receipts for other expenses, like tolls,
              meals, or lodging
            </strong>
            , you can file your travel claim through the{' '}
            <va-link
              external
              href={BTSSS_PORTAL_URL}
              text="Beneficiary Travel Self-Service System"
            />
            .
          </p>
        </>
      )}
    </>
  );
}

SmocEntryContent.propTypes = {
  complexClaimsEnabled: PropTypes.bool,
};

export default function TravelPayStatusContent() {
  const dispatch = useDispatch();
  const { claims, isLoading } = useSelector(
    state => state.travelPay.travelClaims,
  );

  const [availableDateRanges, setAvailableDateRanges] = useState();
  const [selectedDateRange, setSelectedDateRange] = useState();

  const setInitialDateSelection = useCallback(() => {
    const dateFilters = getDateFilters();
    if (dateFilters.length) {
      setSelectedDateRange(dateFilters[0]);
      setAvailableDateRanges(dateFilters);
    }
  }, []);

  useEffect(
    () => {
      setInitialDateSelection();
    },
    [setInitialDateSelection],
  );

  const onDateRangeChange = e => {
    setSelectedDateRange(JSON.parse(e.target.value));
  };

  useEffect(
    () => {
      if (
        selectedDateRange &&
        availableDateRanges &&
        !claims[selectedDateRange.value]
      ) {
        // Fetch claims data if it hasn't been fetched yet
        // or if the selected date range has changed
        dispatch(getTravelClaims(selectedDateRange));
      }
    },
    [dispatch, selectedDateRange, availableDateRanges, claims],
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const canViewClaimDetails = useToggleValue(
    TOGGLE_NAMES.travelPayViewClaimDetails,
  );
  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );
  const claimsMgmtToggle = useToggleValue(
    TOGGLE_NAMES.travelPayClaimsManagement,
  );
  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--8">
      {smocEnabled ? (
        <SmocEntryContent complexClaimsEnabled={complexClaimsEnabled} />
      ) : (
        <>
          <h2 className="vads-u-font-size--h4">
            You can use this tool to check the status of your VA travel claims.
          </h2>
          {!isLoading && (
            <va-additional-info
              class="vads-u-margin-y--3"
              trigger="How to manage your claims or get more information"
            >
              <>
                <HelpTextManage />
                <va-link
                  data-testid="status-explainer-link"
                  href="/my-health/travel-pay/help"
                  text="What does my claim status mean?"
                />
              </>
            </va-additional-info>
          )}
        </>
      )}

      <div className="btsss-claims-sort-and-filter-container">
        <h2 className="vads-u-margin-top--2">Your travel claims</h2>
        <p>
          {complexClaimsEnabled
            ? "This list shows all the travel reimbursement claims you've started or filed."
            : "This list shows all the appointments you've filed a travel claim for."}
        </p>
        {smocEnabled &&
          !claimsMgmtToggle && (
            <va-additional-info
              class="vads-u-margin-y--3"
              trigger="How to manage your claims or get more information"
            >
              <div>
                <p className="vads-u-margin-top--0">
                  You can call the BTSSS call center at{' '}
                  <va-telephone contact="8555747292" /> (
                  <va-telephone tty contact="711" />) Monday through Friday,
                  8:00 a.m. to 8:00 p.m. ET. Have your claim number ready to
                  share when you call.
                </p>
                <va-link
                  data-testid="status-explainer-link"
                  href="/my-health/travel-pay/help"
                  text="What does my claim status mean?"
                />
              </div>
            </va-additional-info>
          )}
      </div>

      {isLoading && (
        <va-loading-indicator
          label="Loading"
          message="Loading Travel Claims..."
        />
      )}
      {!isLoading &&
        availableDateRanges &&
        selectedDateRange && (
          <div className="vads-u-margin-bottom--2">
            <TravelPayDateRangeSelect
              availableDateRanges={availableDateRanges}
              selectedDateRange={selectedDateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        )}
      {!isLoading &&
        selectedDateRange &&
        claims[selectedDateRange.value] && (
          <TravelPayStatusList
            claims={claims[selectedDateRange.value]}
            canViewClaimDetails={canViewClaimDetails}
          />
        )}
      {claimsMgmtToggle && (
        <div className="vads-u-margin-top--4">
          <va-need-help>
            <div slot="content">
              <HelpTextGeneral />
            </div>
          </va-need-help>
        </div>
      )}
      <VaBackToTop />
    </div>
  );
}
