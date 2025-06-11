import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
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
import { getSlotByDate } from './utils/provider';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../utils/timezone';
import ProviderAddress from './components/ProviderAddress';
import { titleCase } from '../utils/formatters';

const ReviewAndConfirm = props => {
  const { attributes: currentReferral } = props.currentReferral;
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
  const [createFailed, setCreateFailed] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const slotDetails = getSlotByDate(
    draftAppointmentInfo?.attributes?.slots,
    selectedSlot,
  );
  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.referringFacility.code,
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
        dispatch(
          createDraftReferralAppointment(currentReferral.referralNumber),
        );
      } else if (draftAppointmentCreateStatus === FETCH_STATUS.succeeded) {
        setLoading(false);
      } else if (draftAppointmentCreateStatus === FETCH_STATUS.failed) {
        setLoading(false);
        setFailed(true);
      }
    },
    [currentReferral.referralNumber, dispatch, draftAppointmentCreateStatus],
  );

  useEffect(
    () => {
      if (
        !selectedSlot &&
        savedSelectedSlot &&
        draftAppointmentCreateStatus === FETCH_STATUS.succeeded
      ) {
        const savedSlot = getSlotByDate(
          draftAppointmentInfo?.attributes?.slots,
          savedSelectedSlot,
        );
        if (!savedSlot) {
          routeToCCPage(history, 'scheduleReferral');
        } else {
          dispatch(setSelectedSlot(savedSlot.start));
        }
      }
    },
    [
      dispatch,
      savedSelectedSlot,
      draftAppointmentInfo,
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

  // handle routing to the next page once the appointment is created
  // or show error message if the appointment creation failed
  useEffect(
    () => {
      if (appointmentCreateStatus === FETCH_STATUS.loading) {
        setCreateLoading(true);
        setCreateFailed(false);
      }
      if (
        appointmentCreateStatus === FETCH_STATUS.succeeded &&
        draftAppointmentInfo?.id
      ) {
        setCreateLoading(false);
        routeToNextReferralPage(
          history,
          'reviewAndConfirm',
          currentReferral.uuid,
          draftAppointmentInfo.id,
        );
      } else if (
        appointmentCreateStatus === FETCH_STATUS.failed &&
        draftAppointmentInfo?.id &&
        draftAppointmentCreateStatus === FETCH_STATUS.succeeded
      ) {
        setCreateLoading(false);
        setCreateFailed(true);
      }
    },
    [
      appointmentCreateStatus,
      draftAppointmentInfo?.id,
      currentReferral.uuid,
      draftAppointmentCreateStatus,
      history,
    ],
  );

  if (loading) {
    return (
      <ReferralLayout
        hasEyebrow
        heading="Review your appointment details"
        loadingMessage="Loading your appointment details"
        apiFailure={failed}
      />
    );
  }
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
                {`${titleCase(currentReferral.categoryOfCare)} Provider`}
              </h2>
            </div>
          </div>
        </div>
        <p className="vads-u-margin--0">
          {draftAppointmentInfo.attributes.provider.name} <br />
          {draftAppointmentInfo.attributes.provider.providerOrganization.name}
        </p>
        {draftAppointmentInfo.attributes.provider.location.address}
        {currentReferral.provider?.telephone && (
          <p className="vads-u-margin--0" data-testid="phone">
            Phone:{' '}
            <va-telephone
              contact={currentReferral.provider?.telephone}
              data-testid="provider-telephone"
            />
          </p>
        )}
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
                currentReferral.referringFacility.code,
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
            loading={createLoading}
            class="vads-u-margin-left--2"
            label="Continue"
            text="Continue"
            uswds
            onClick={e => {
              e.preventDefault();
              dispatch(
                createReferralAppointment({
                  draftApppointmentId: draftAppointmentInfo.id,
                  referralNumber: currentReferral.referralNumber,
                  slotId: slotDetails.id,
                  networkId:
                    draftAppointmentInfo.attributes.provider.networkIds[0],
                  providerServiceId:
                    draftAppointmentInfo.attributes.provider.id,
                }),
              );
            }}
          />
        </div>
        {createFailed &&
          !createLoading && (
            <va-alert
              status="error"
              data-testid="create-error-alert"
              class="vads-u-margin-top--4"
            >
              <h3>We couldn’t schedule this appointment</h3>
              <p>
                We’re sorry. Something went wrong when we tried to submit your
                appointment. You can try again later, or call your referring VA
                facility to help with your appointment.
              </p>
              <strong>{currentReferral.referringFacility.name}</strong>
              <br />
              <ProviderAddress
                address={currentReferral.referringFacility.address}
                phone={currentReferral.referringFacility.phone}
                showDirections
                directionsName={currentReferral.referringFacility.name}
              />
            </va-alert>
          )}
      </div>
    </ReferralLayout>
  );
};

ReviewAndConfirm.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};

export default ReviewAndConfirm;
