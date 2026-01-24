import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAppointmentCreateStatus,
  getSelectedSlotStartTime,
} from './redux/selectors';
import { setFormCurrentPage, setSelectedSlotStartTime } from './redux/actions';
import {
  useGetDraftReferralAppointmentQuery,
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
import FindCommunityCareOfficeLink from './components/FindCCFacilityLink';
import { titleCase } from '../utils/formatters';

const ReviewAndConfirm = props => {
  const { attributes: currentReferral } = props.currentReferral;
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedSlot = useSelector(state => getSelectedSlotStartTime(state));

  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const [failed, setFailed] = useState(false);
  const [skipDraft, setSkipDraft] = useState(false);
  const [createFailed, setCreateFailed] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const savedSelectedSlot = sessionStorage.getItem(
    getReferralSlotKey(currentReferral.uuid),
  );
  const {
    data: draftAppointmentInfo,
    isLoading: isDraftLoading,
    isError: isDraftError,
    isSuccess: isDraftSuccess,
    isUninitialized: isDraftUninitialized,
  } = useGetDraftReferralAppointmentQuery(
    {
      referralNumber: currentReferral.referralNumber,
      referralConsultId: currentReferral.referralConsultId,
    },
    { skip: skipDraft },
  );
  // Use savedSelectedSlot as fallback to handle sessionStorage restoration timing
  const slotDetails = getSlotByDate(
    draftAppointmentInfo?.attributes?.slots,
    selectedSlot || savedSelectedSlot,
  );
  const [
    postReferralAppointment,
    {
      data: appointmentInfo,
      isError: isAppointmentError,
      isLoading: isAppointmentLoading,
      isSuccess: isAppointmentSuccess,
    },
  ] = usePostReferralAppointmentMutation();
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
      if (!isDraftLoading && !isDraftUninitialized) {
        setSkipDraft(true);
      }
      if (isDraftError) {
        setFailed(true);
      }
    },
    [
      draftAppointmentInfo,
      currentReferral.referralNumber,
      dispatch,
      isDraftError,
      isDraftSuccess,
      isDraftLoading,
      isDraftUninitialized,
      currentReferral.referralConsultId,
    ],
  );

  useEffect(
    () => {
      if (!selectedSlot && savedSelectedSlot && isDraftSuccess) {
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
      selectedSlot,
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
      if (isAppointmentLoading) {
        setCreateLoading(true);
        setCreateFailed(false);
      }
      if (isAppointmentSuccess && draftAppointmentInfo?.id) {
        setCreateLoading(false);
        routeToNextReferralPage(
          history,
          'reviewAndConfirm',
          currentReferral.uuid,
          draftAppointmentInfo.id,
        );
        // CI-FIX: Removed draftAppointmentInfo?.id check from error condition.
        // When isAppointmentError is true (submit failed), draftAppointmentInfo.id
        // is guaranteed to exist because the user can only click "Continue" after
        // the draft appointment loads. The extra check was defensive but unnecessary.
      } else if (isAppointmentError) {
        setCreateLoading(false);
        setCreateFailed(true);
      }
    },
    [
      isAppointmentSuccess,
      isAppointmentLoading,
      isAppointmentError,
      appointmentCreateStatus,
      appointmentInfo?.id,
      draftAppointmentInfo?.id,
      currentReferral.uuid,
      isDraftSuccess,
      history,
      draftAppointmentInfo,
      dispatch,
    ],
  );

  // Check for error state before showing loading indicator to prevent race condition
  // where isDraftError becomes true while isDraftLoading is still true
  if (isDraftLoading && !isDraftError) {
    return (
      <ReferralLayout
        hasEyebrow
        heading="Review your appointment details"
        loadingMessage="Loading your appointment details"
        apiFailure={false}
      />
    );
  }
  const headingStyles =
    'vads-u-margin--0 vads-u-font-family--sans vads-u-font-weight--bold vads-u-font-size--source-sans-normalized';
  return (
    <ReferralLayout
      hasEyebrow
      heading="Review your appointment details"
      apiFailure={failed || isDraftError}
      loadingMessage={
        isDraftLoading && !isDraftError
          ? 'Loading your appointment details'
          : null
      }
    >
      <div>
        <hr className="vads-u-margin-y--2" />
        {isAppointmentSuccess && <p data-testid="success-text">success</p>}
        {draftAppointmentInfo?.attributes && (
          <>
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
                {
                  draftAppointmentInfo.attributes.provider.providerOrganization
                    .name
                }
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
                      draftAppointmentInfo.attributes.provider.location
                        .timezone,
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
                    providerServiceId:
                      draftAppointmentInfo.attributes.provider.id,
                  });
                }}
              />
            </div>
          </>
        )}
        {/* CI-FIX: Also check isAppointmentError directly to handle race condition where
            RTK Query sets isAppointmentError=true before useEffect updates createFailed state.
            This ensures error alert shows immediately when the mutation fails. */}
        {(createFailed || isAppointmentError) &&
          !createLoading && (
            <va-alert
              status="error"
              data-testid="create-error-alert"
              class="vads-u-margin-top--4"
            >
              <h3>We couldn’t schedule this appointment</h3>
              <p className="vads-u-margin-top--1 vads-u-margin-bottom--1">
                We’re sorry. Something went wrong when we tried to schedule your
                appointment. Try again later, or call this provider to schedule
                an appointment. If you have questions about scheduling an
                appointment, or about how many appointments you have left, call
                your facility’s community care office.
              </p>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                <FindCommunityCareOfficeLink />
              </p>
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
