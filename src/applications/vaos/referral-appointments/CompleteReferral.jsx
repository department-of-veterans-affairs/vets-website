import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  useLocation,
  useRouteMatch,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format, intervalToDuration } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import ReferralLayout from './components/ReferralLayout';
import AddToCalendarButton from '../components/AddToCalendarButton';
import { setFormCurrentPage } from './redux/actions';
import { useGetProviderById } from './hooks/useGetProviderById';
import { getReferralSlotKey } from './utils/referrals';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneByFacilityId,
} from '../utils/timezone';
import { getSlotById } from './utils/provider';
import FacilityDirectionsLink from '../components/FacilityDirectionsLink';
import State from '../components/State';
import { routeToCCPage } from './flow';
import CCAppointmentCard from './components/CCAppointmentCard';

export default function CompleteReferral(props) {
  const { currentReferral } = props;
  const { search } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(setFormCurrentPage('complete'));
    },
    [dispatch],
  );

  const basePath = useRouteMatch();
  const { provider, loading, failed } = useGetProviderById(
    currentReferral?.providerId,
  );

  if (failed) {
    return (
      <ReferralLayout>
        <CCAppointmentCard>
          <va-alert status="error" data-testid="error-alert">
            <p className="vads-u-margin-y--0">
              We’re sorry. There was a problem with our system. We couldn’t
              process this appointment. Call us at 877-470-5947. Monday through
              Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </va-alert>
        </CCAppointmentCard>
      </ReferralLayout>
    );
  }

  const savedSelectedSlotKey = getReferralSlotKey(currentReferral.UUID);
  const savedSlotId = sessionStorage.getItem(savedSelectedSlotKey);

  if (loading && !failed) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading">
        <va-loading-indicator message="Loading your appointment details" />
      </div>
    );
  }

  if (!savedSlotId || !provider) {
    return <Redirect from={basePath.url} to="/" />;
  }

  const params = new URLSearchParams(search);
  const comfirmMessage = params.get('confirmMsg') === 'true';

  const savedSlot = getSlotById(provider.slots, savedSlotId);

  const savedDate = new Date(savedSlot.start);
  const timeZoneAbr = getTimezoneAbbrByFacilityId(
    currentReferral.ReferringFacilityInfo.FacilityCode,
  );
  const timeZone = getTimezoneByFacilityId(
    currentReferral.ReferringFacilityInfo.FacilityCode,
  );

  const appointmentDuration = intervalToDuration({
    start: new Date(savedSlot.start),
    end: new Date(savedSlot.end),
  });

  return (
    <ReferralLayout>
      <CCAppointmentCard>
        <div
          data-testid="referral-content"
          className="vads-u-background-color--success-lighter  vads-u-padding-x--2 vads-u-padding-y--1 vads-u-margin-y--2p5"
        >
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
            {comfirmMessage
              ? 'We’ve scheduled and confirmed your appointment.'
              : 'You already scheduled your first appointment for this referral'}
          </h3>
          {comfirmMessage && (
            <>
              <va-link
                href="#"
                data-testid="review-appointments-link"
                onClick={e => {
                  e.preventDefault();
                  routeToCCPage(history, 'appointments');
                }}
                text="Review your appointments"
              />
            </>
          )}
          {!comfirmMessage && (
            <p
              data-testid="contact-va-for-questions"
              className="vads-u-margin-bottom--0"
            >
              Contact your referring VA if you have questions.
            </p>
          )}
        </div>
        <h5 className="vads-u-margin-bottom--0p5">When</h5>
        <p
          data-testid="appointment-date-time"
          className="vads-u-margin-top--0 vads-u-margin-bottom--1"
        >
          {`${format(savedDate, 'EEEE, MMMM dd, yyyy')}`}
          <br />
          {`${formatInTimeZone(
            savedDate,
            timeZone,
            'h:mm aaaa',
          )} ${timeZoneAbr}`}
        </p>
        <AddToCalendarButton
          data-testid="add-to-calendar-button"
          facility={currentReferral.ReferringFacilityInfo}
          appointment={{
            vaos: {
              isCommunityCare: true,
            },
            start: savedSlot.start,
            minutesDuration: appointmentDuration.minutes,
            videoData: {},
          }}
        />
        <h5 className="vads-u-margin-bottom--0p5">What</h5>
        <p data-testid="referral-category-of-care" className="vads-u-margin--0">
          {currentReferral.CategoryOfCare}
        </p>
        <h5 className="vads-u-margin-bottom--0p5">Who</h5>
        <p data-testid="provider-name" className="vads-u-margin--0">
          {provider.providerName}
        </p>
        <h5 className="vads-u-margin-bottom--0p5">Where to attend</h5>
        <p data-testid="provider-org-name" className="vads-u-margin--0">
          {provider.orgName}
        </p>
        <p data-testid="provider-address" className="vads-u-margin--0">
          {provider.orgAddress.street1}
          {provider.orgAddress.street2 && (
            <>
              <br />
              {provider.orgAddress.street2}
            </>
          )}
          <br />
          {provider.orgAddress.city},{' '}
          <State state={provider.orgAddress.state} /> {provider.orgAddress.zip}
        </p>
        <div className="vads-u-margin-top--0p5">
          <FacilityDirectionsLink
            icon
            data-testid="facility-directions-link"
            location={{
              address: {
                street: provider.orgAddress.street1,
                city: provider.orgAddress.city,
                state: provider.orgAddress.state,
                zipCode: provider.orgAddress.zip,
              },
            }}
          />
        </div>
        <p className="vads-u-margin-y--2">
          Phone:{' '}
          <va-telephone
            contact={provider.orgPhone}
            data-testid="provider-telephone"
          />
        </p>
        <h5 className="vads-u-margin-bottom--0p5">Need to make changes?</h5>
        <p data-testid="changes-copy" className="vads-u-margin--0">
          Contact this referring VA facility if you need to reschedule or cancel
          your appointment and notify the VA of any changes.
        </p>
        <p
          className="vads-u-margin-bottom--0 vads-u-margin-top--1p5"
          data-testid="provider-facility-org-name"
        >
          {`Faciliy: ${provider.orgName}`}
        </p>
        <p className="vads-u-margin--0">
          Phone:{' '}
          <va-telephone
            contact={currentReferral.ReferringFacilityInfo.Phone}
            data-testid="referring-facility-telephone"
          />{' '}
          <va-telephone
            data-testid="referring-facility-telephone-tty"
            tty
            contact="711"
          />
        </p>
        <div className="vads-u-margin-top--4 vaos-appts__block-label vaos-hide-for-print">
          <va-button
            className="va-button-link"
            onClick={() => window.print()}
            text="Print"
            data-testid="print-button"
            uswds
            secondary
          />
        </div>
      </CCAppointmentCard>
    </ReferralLayout>
  );
}
CompleteReferral.propTypes = {
  currentReferral: PropTypes.object,
};
