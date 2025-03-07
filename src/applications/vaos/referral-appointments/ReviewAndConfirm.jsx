import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import {
  getAppointmentCreateStatus,
  getDraftAppointmentInfo,
  getSelectedSlot,
} from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';
import {
  createReferralAppointment,
  createDraftReferralAppointment,
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
  const { draftAppointmentInfo, draftAppointmentCreateStatus } = useSelector(
    state => getDraftAppointmentInfo(state),
    shallowEqual,
  );

  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const slotDetails = getSlotById(
    draftAppointmentInfo.slots?.slots,
    selectedSlot,
  );
  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.referringFacilityInfo.facilityCode,
  );
  const savedSelectedSlot = sessionStorage.getItem(
    getReferralSlotKey(currentReferral.uuid),
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
        routeToCCPage(history, 'scheduleReferral', currentReferral.uuid);
      }
    },
    [currentReferral.uuid, history, savedSelectedSlot, selectedSlot],
  );

  useEffect(
    () => {
      if (draftAppointmentCreateStatus === FETCH_STATUS.notStarted) {
        dispatch(createDraftReferralAppointment(currentReferral.uuid));
      } else if (draftAppointmentCreateStatus === FETCH_STATUS.succeeded) {
        setLoading(false);
        scrollAndFocus('h1');
      } else if (draftAppointmentCreateStatus === FETCH_STATUS.failed) {
        setLoading(false);
        setFailed(true);
        scrollAndFocus('h2');
      }
    },
    [currentReferral.uuid, dispatch, draftAppointmentCreateStatus],
  );

  useEffect(
    () => {
      if (
        !selectedSlot &&
        savedSelectedSlot &&
        draftAppointmentCreateStatus === FETCH_STATUS.succeeded
      ) {
        const savedSlot = getSlotById(
          draftAppointmentInfo.slots.slots,
          savedSelectedSlot,
        );
        if (!savedSlot) {
          routeToCCPage(history, 'scheduleReferral');
        }
        dispatch(setSelectedSlot(savedSlot.id));
      }
    },
    [
      dispatch,
      savedSelectedSlot,
      draftAppointmentInfo.slots,
      history,
      draftAppointmentCreateStatus,
      selectedSlot,
    ],
  );

  const handleGoBack = e => {
    e.preventDefault();
    routeToPreviousReferralPage(
      history,
      'reviewAndConfirm',
      currentReferral.uuid,
    );
  };

  useEffect(
    () => {
      if (
        appointmentCreateStatus === FETCH_STATUS.succeeded &&
        draftAppointmentInfo?.appointment?.id
      ) {
        routeToNextReferralPage(
          history,
          'reviewAndConfirm',
          null,
          draftAppointmentInfo.appointment.id,
        );
      }
    },
    [appointmentCreateStatus, draftAppointmentInfo?.appointment?.id, history],
  );

  const headingStyles =
    'vads-u-margin--0 vads-u-font-family--sans vads-u-font-weight--bold vads-u-font-size--source-sans-normalized';
  return (
    <ReferralLayout
      hasEyebrow
      heading="Review your appointment details"
      apiFailure={failed}
      loadingMessage={loading ? 'Loading your appointment details' : null}
    >
      <div>
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col">
              <h2 className={headingStyles}>
                {`${currentReferral.categoryOfCare} Provider`}
              </h2>
            </div>
          </div>
        </div>
        <p className="vads-u-margin--0">
          {draftAppointmentInfo.provider.name} <br />
          {draftAppointmentInfo.provider.providerOrganization.name}
        </p>
        <ProviderAddress
          address={currentReferral.referringFacilityInfo.address}
          phone={currentReferral.referringFacilityInfo.phone}
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
                  currentReferral.uuid
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
                currentReferral.referringFacilityInfo.facilityCode,
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
            data-testid="continue-button"
            class="vads-u-margin-left--2"
            label="Continue"
            text="Continue"
            uswds
            onClick={e => {
              e.preventDefault();
              dispatch(
                createReferralAppointment({
                  referralId: currentReferral.uuid,
                  slotId: selectedSlot,
                  draftApppointmentId: draftAppointmentInfo.appointment.id,
                }),
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
