import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAppointmentCreateStatus,
  getSelectedSlotStartTime,
} from './redux/selectors';
import {
  POST_DRAFT_REFERRAL_APPOINTMENT_CACHE,
} from '../utils/constants';
import {
  setFormCurrentPage,
  setSelectedSlotStartTime,
} from './redux/actions';
import { usePostDraftReferralAppointmentMutation } from '../redux/api/vaosApi';
import { getAppointmentCreateStatus } from './redux/selectors';
import { POST_DRAFT_REFERRAL_APPOINTMENT_CACHE } from '../utils/constants';
import { setFormCurrentPage } from './redux/actions';
import {
  usePostDraftReferralAppointmentMutation,
  usePostReferralAppointmentMutation,
} from '../redux/api/vaosApi';

import ReferralLayout from './components/ReferralLayout';
import {
  routeToPreviousReferralPage,
  routeToCCPage,
  routeToNextReferralPage,
} from './flow';

import { getReferralSlotKey } from './utils/referrals';
import { getSlotByDate } from './utils/provider';
import { stripDST } from '../utils/timezone';
import ProviderAddress from './components/ProviderAddress';
import { titleCase } from '../utils/formatters';

const ReviewAndConfirm = props => {
  const { attributes: currentReferral } = props.currentReferral;
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedSlotStartTime = useSelector(getSelectedSlotStartTime);
  const [
    postDraftReferralAppointment,
    {
      data: draftAppointmentInfo,
      isError: isDraftError,
      isLoading: isDraftLoading,
      isUninitialized: isDraftUninitialized,
      isSuccess: isDraftSuccess,
    },
  ] = usePostDraftReferralAppointmentMutation({
    fixedCacheKey: POST_DRAFT_REFERRAL_APPOINTMENT_CACHE,
  });

  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [createFailed, setCreateFailed] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const slotDetails = getSlotByDate(
    draftAppointmentInfo?.attributes?.slots,
    selectedSlotStartTime,
  );
  const savedSelectedSlot = sessionStorage.getItem(
    getReferralSlotKey(currentReferral.uuid),
  );
  const [
    postReferralAppointment,
    { data: appointmentInfo, isError, isLoading, isSuccess },
  ] = usePostReferralAppointmentMutation({
    fixedCacheKey: 'postReferralAppointmentCache',
  });
  useEffect(
    () => {
      dispatch(setFormCurrentPage('reviewAndConfirm'));
    },
    [dispatch],
  );
  useEffect(
    () => {
      if (!selectedSlotStartTime && !savedSelectedSlot) {
        routeToCCPage(history, 'scheduleReferral', currentReferral.uuid);
      }
    },
    [currentReferral.uuid, history, savedSelectedSlot, selectedSlotStartTime],
  );

  useEffect(
    () => {
      if (isDraftUninitialized) {
        postDraftReferralAppointment({
          referralNumber: currentReferral.referralNumber,
          referralConsultId: currentReferral.referralConsultId,
        });
      } else if (isDraftSuccess) {
        setLoading(false);
      } else if (isDraftError) {
        setLoading(false);
        setFailed(true);
      }
    },
    [
      currentReferral,
      dispatch,
      isDraftError,
      isDraftSuccess,
      isDraftUninitialized,
      postDraftReferralAppointment,
    ],
  );

  useEffect(
    () => {
      if (!selectedSlotStartTime && savedSelectedSlot && isDraftSuccess) {
        const savedSlot = getSlotByDate(
          draftAppointmentInfo?.attributes?.slots,
          savedSelectedSlot,
        );
        if (!savedSlot) {
          routeToCCPage(history, 'scheduleReferral');
        } else {
          dispatch(setSelectedSlotStartTime(savedSlot.start));
        }
      }
    },
    [
      dispatch,
      savedSelectedSlot,
      draftAppointmentInfo,
      history,
      selectedSlotStartTime,
      isDraftSuccess,
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
      if (isLoading) {
        setCreateLoading(true);
        setCreateFailed(false);
      }
      if (isSuccess && draftAppointmentInfo?.id) {
        setCreateLoading(false);
        routeToNextReferralPage(
          history,
          'reviewAndConfirm',
          currentReferral.uuid,
          draftAppointmentInfo.id,
        );
      } else if (isError && draftAppointmentInfo?.id && isDraftSuccess) {
        setCreateLoading(false);
        setCreateFailed(true);
      }
    },
    [
      isSuccess,
      isLoading,
      isError,
      appointmentCreateStatus,
      appointmentInfo?.id,
      draftAppointmentInfo?.id,
      currentReferral.uuid,
      isDraftSuccess,
      history,
    ],
  );

  if (loading || isDraftLoading) {
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
        {isSuccess && <p data-testid="success-text">success</p>}
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col">
              <h2 className={headingStyles}>
                <span data-dd-privacy="mask">
                  {`${titleCase(currentReferral.categoryOfCare)} provider`}
                </span>
              </h2>
            </div>
          </div>
        </div>
        <p className="vads-u-margin--0">
          <span data-dd-privacy="mask">
            {draftAppointmentInfo.attributes.provider.name}
          </span>{' '}
          <br />
          <span data-dd-privacy="mask">
            {draftAppointmentInfo.attributes.provider.providerOrganization.name}
          </span>
        </p>
        {draftAppointmentInfo.attributes.provider.location.address}
        {currentReferral.provider?.telephone && (
          <p className="vads-u-margin--0" data-testid="phone">
            Phone:{' '}
            <span data-dd-privacy="mask">
              <va-telephone
                contact={currentReferral.provider?.telephone}
                data-testid="provider-telephone"
              />
            </span>
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
                draftAppointmentInfo.attributes.provider.location.timezone,
                'EEEE, LLLL d, yyyy',
              )}
            </>
            <br />
            <>
              {stripDST(
                formatInTimeZone(
                  new Date(slotDetails.start),
                  draftAppointmentInfo.attributes.provider.location.timezone,
                  'h:mm aaaa zzz',
                ),
              )}
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
            label="Confirm"
            text="Confirm"
            uswds
            onClick={e => {
              e.preventDefault();
              postReferralAppointment({
                draftApppointmentId: draftAppointmentInfo.id,
                referralNumber: currentReferral.referralNumber,
                slotId: slotDetails.id,
                networkId:
                  draftAppointmentInfo.attributes.provider.networkIds[0],
                providerServiceId: draftAppointmentInfo.attributes.provider.id,
              });
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
