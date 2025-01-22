import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { getProviderInfo, getSelectedSlot } from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';
import {
  fetchProviderDetails,
  setFormCurrentPage,
  setSelectedSlot,
} from './redux/actions';
import ReferralLayout from './components/ReferralLayout';
import {
  routeToPreviousReferralPage,
  routeToCCPage,
  routeToNextReferralPage,
} from './flow';
import { getReferralSlotKey } from './utils/referrals';
import { getSlotById } from './utils/provider';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../utils/timezone';
import ProviderAddress from './components/ProviderAddress';

const ReviewAndConfirm = props => {
  const { currentReferral } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedSlot = useSelector(state => getSelectedSlot(state));
  const { provider, providerFetchStatus } = useSelector(
    state => getProviderInfo(state),
    shallowEqual,
  );
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const slotDetails = getSlotById(provider.slots, selectedSlot);
  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.ReferringFacilityInfo.FacilityCode,
  );
  const savedSelectedSlot = sessionStorage.getItem(
    getReferralSlotKey(currentReferral.UUID),
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('reviewAndConfirm'));
    },
    [dispatch],
  );
  useEffect(
    () => {
      if (!selectedSlot && !savedSelectedSlot) {
        routeToCCPage(history, 'scheduleReferral', currentReferral.UUID);
      }
    },
    [currentReferral.UUID, history, savedSelectedSlot, selectedSlot],
  );

  useEffect(
    () => {
      if (providerFetchStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchProviderDetails(currentReferral.providerId));
      } else if (providerFetchStatus === FETCH_STATUS.succeeded) {
        setLoading(false);
        scrollAndFocus('h1');
      } else if (providerFetchStatus === FETCH_STATUS.failed) {
        setLoading(false);
        setFailed(true);
        scrollAndFocus('h2');
      }
    },
    [currentReferral.providerId, dispatch, providerFetchStatus],
  );

  useEffect(
    () => {
      if (
        !selectedSlot &&
        savedSelectedSlot &&
        providerFetchStatus === FETCH_STATUS.succeeded
      ) {
        const savedSlot = getSlotById(provider.slots, savedSelectedSlot);
        if (!savedSlot) {
          routeToCCPage(history, 'scheduleReferral');
        }
        dispatch(setSelectedSlot(savedSlot.id));
      }
    },
    [
      dispatch,
      savedSelectedSlot,
      provider.slots,
      history,
      providerFetchStatus,
      selectedSlot,
    ],
  );

  const handleGoBack = e => {
    e.preventDefault();
    routeToPreviousReferralPage(
      history,
      'reviewAndConfirm',
      currentReferral.UUID,
    );
  };

  if (loading) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading">
        <va-loading-indicator message="Loading schedule referral review..." />
      </div>
    );
  }
  const headingStyles =
    'vads-u-margin--0 vads-u-font-family--sans vads-u-font-weight--bold vads-u-font-size--source-sans-normalized';
  return (
    <ReferralLayout
      hasEyebrow
      heading="Review your appointment details"
      apiFailure={failed}
    >
      <div>
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col">
              <h2 className={headingStyles}>
                {`${currentReferral.CategoryOfCare} Provider`}
              </h2>
            </div>
          </div>
        </div>
        <p className="vads-u-margin--0">
          {provider.providerName} <br />
          {provider.orgName}
        </p>
        <ProviderAddress
          address={provider.orgAddress}
          phone={provider.orgPhone}
        />
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col">
              <h2 className={headingStyles}>Date and time</h2>
            </div>
            <div className="vads-l-col vads-u-text-align--right">
              <va-link
                href={`/my-health/appointments/schedule-referral/date-time?id=${
                  currentReferral.UUID
                }`}
                label="Edit date and time"
                text="Edit"
                data-testid="edit-when-information-link"
                onClick={e => {
                  handleGoBack(e);
                }}
              />
            </div>
          </div>
        </div>
        {slotDetails && (
          <p className="vads-u-margin--0" data-testid="slot-day-time">
            <>
              {formatInTimeZone(
                new Date(slotDetails.start),
                facilityTimeZone,
                'EEEE, LLLL d, yyyy',
              )}
            </>
            <br />
            <>
              {formatInTimeZone(
                new Date(slotDetails.start),
                facilityTimeZone,
                'h:mm aaaa',
              )}{' '}
              {`${getTimezoneDescByFacilityId(
                currentReferral.ReferringFacilityInfo.FacilityCode,
              )}`}
            </>
          </p>
        )}
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-margin-top--4">
          <va-button
            label="Back"
            text="Back"
            secondary
            uswds
            onClick={e => {
              handleGoBack(e);
            }}
          />
          <va-button
            class="vads-u-margin-left--2"
            label="Continue"
            text="Continue"
            uswds
            onClick={e => {
              e.preventDefault();
              // TODO: submit the referral here and poll for status
              routeToNextReferralPage(
                history,
                'reviewAndConfirm',
                currentReferral.UUID,
              );
            }}
          />
        </div>
      </div>
    </ReferralLayout>
  );
};

ReviewAndConfirm.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};

export default ReviewAndConfirm;
