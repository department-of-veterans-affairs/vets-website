import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaBackToTop } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { focusElement } from 'platform/utilities/ui';

import Breadcrumbs from '../components/Breadcrumbs';
import { HelpTextManage } from '../components/HelpText';
import { getTravelClaims } from '../redux/actions';
import { getDateFilters } from '../util/dates';
import { BTSSS_PORTAL_URL } from '../constants';
import useSetPageTitle from '../hooks/useSetPageTitle';
import DowntimeWindowAlert from './DownTimeWindowAlert';
import TravelPayStatusList from '../components/TravelPayStatusList';
import TravelPayDateRangeSelect from '../components/TravelPayDateRangeSelect';

function SmocEntryContent() {
  return (
    <>
      <p className="vads-u-font-family--serif vads-u-font-size--lg">
        File new claims for travel reimbursement and review the status of all
        your travel claims.
      </p>
      <h2 className="vads-u-margin-top--2">
        File a new claim for travel reimbursement online
      </h2>
      <p>
        If you’re claiming mileage only, you can file a travel claim for
        eligible past appointments here on VA.gov.
      </p>
      <va-link-action
        href="/my-health/appointments/past"
        text="Go to your past appointments"
        class="vads-u-margin-y--1"
      />
      <p>
        <strong>
          If you need to submit receipts for other expenses, like tolls, meals,
          or lodging
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
  );
}

export default function TravelPayStatusApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    focusElement('h1');
  });

  const [availableDateRanges, setAvailableDateRanges] = useState();
  const [selectedDateRange, setSelectedDateRange] = useState();

  const { claims, isLoading } = useSelector(
    state => state.travelPay.travelClaims,
  );

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

  const setInitialDateSelection = useCallback(() => {
    const dateFilters = getDateFilters();
    if (dateFilters.length) {
      setSelectedDateRange(dateFilters[0]);
      setAvailableDateRanges(dateFilters);
    }
  }, []);

  useEffect(() => {
    setInitialDateSelection();
  }, []);

  const onDateRangeChange = e => {
    setSelectedDateRange(JSON.parse(e.target.value));
  };

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const canViewClaimDetails = useToggleValue(
    TOGGLE_NAMES.travelPayViewClaimDetails,
  );
  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  const title = smocEnabled
    ? 'Travel reimbursement claims'
    : 'Check your travel reimbursement claim status';

  useSetPageTitle(title);

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  if (!appEnabled) {
    window.location.replace('/');
    return null;
  }

  return (
    <article className="usa-grid-full vads-u-padding-bottom--0">
      <Breadcrumbs />
      <h1 tabIndex="-1" data-testid="header">
        {title}
      </h1>
      <DowntimeWindowAlert appTitle={title}>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {smocEnabled ? (
            <SmocEntryContent />
          ) : (
            <>
              <h2 className="vads-u-font-size--h4">
                You can use this tool to check the status of your VA travel
                claims.
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
              This list shows all the appointments you've filed a travel claim
              for.
            </p>
            {smocEnabled && (
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
          <VaBackToTop />
        </div>
      </DowntimeWindowAlert>
    </article>
  );
}

TravelPayStatusApp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
