import { formatInTimeZone } from 'date-fns-tz';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../../../components/FullWidthLayout';
import InfoAlert from '../../../components/InfoAlert';
import CCLayout from '../../../components/layouts/CCLayout';
import VideoLayout from '../../../components/layouts/VideoLayout';
import {
  isAtlasVideoAppointment,
  isClinicVideoAppointment,
  isInPersonVisit,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { FETCH_STATUS, DATE_FORMATS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import AppointmentDetailsErrorMessage from '../../components/AppointmentDetailsErrorMessage';
import PageLayout from '../../components/PageLayout';
import {
  closeCancelAppointment,
  fetchConfirmedAppointmentDetails,
} from '../../redux/actions';
import {
  getConfirmedAppointmentDetailsInfo,
  selectIsCanceled,
  selectIsPast,
} from '../../redux/selectors';
import DetailsVA from './DetailsVA';
import { selectFeatureUseBrowserTimezone } from '../../../redux/selectors';

export default function UpcomingAppointmentsDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    appointment,
    appointmentDetailsStatus,
    isBadAppointmentId,
    facilityData,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const featureUseBrowserTimezone = useSelector(
    selectFeatureUseBrowserTimezone,
  );
  const isInPerson = isInPersonVisit(appointment);
  const isPast = selectIsPast(appointment);
  const isCanceled = selectIsCanceled(appointment);
  const isVideo = appointment?.vaos?.isVideo;
  const isCommunityCare = appointment?.vaos?.isCommunityCare;
  const isVA = !isVideo && !isCommunityCare;

  const appointmentTypePrefix = isCommunityCare ? 'cc' : 'va';

  useEffect(
    () => {
      dispatch(fetchConfirmedAppointmentDetails(id, appointmentTypePrefix));
      scrollAndFocus();
      return () => {
        dispatch(closeCancelAppointment());
      };
    },
    [id, dispatch, appointmentTypePrefix, featureUseBrowserTimezone],
  );

  useEffect(
    () => {
      let pageTitle = 'VA appointment on';
      let prefix = 'Upcoming';

      if (isCanceled) prefix = 'Canceled';
      else if (isPast) prefix = 'Past';

      if (isCommunityCare)
        pageTitle = `${prefix} Community Care Appointment On`;
      if (isInPerson) {
        if (appointment?.vaos?.isCompAndPenAppointment)
          pageTitle = `${prefix} Claim Exam Appointment On`;
        else pageTitle = `${prefix} In-person Appointment On`;
      }
      if (isVideo) {
        pageTitle = `${prefix} Video Appointment On`;
        if (isClinicVideoAppointment(appointment)) {
          pageTitle = `${prefix} Video Appointment At A VA Location On`;
        }
        if (isAtlasVideoAppointment(appointment)) {
          pageTitle = `${prefix} Video Appointment At An ATLAS Location On`;
        }
      } else if (isVAPhoneAppointment(appointment)) {
        pageTitle = `${prefix} Phone Appointment On`;
      }

      if (appointment && appointment.start) {
        document.title = `${pageTitle} ${formatInTimeZone(
          appointment.start,
          appointment.timezone,
          DATE_FORMATS.friendlyWeekdayDate,
        )} | Veterans Affairs`;
        scrollAndFocus();
      }
    },
    [appointment, isCommunityCare, isCanceled, isInPerson, isPast, isVideo],
  );

  useEffect(
    () => {
      if (
        appointmentDetailsStatus === FETCH_STATUS.failed ||
        (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
      ) {
        scrollAndFocus();
      }
    },
    [appointmentDetailsStatus, appointment],
  );
  if (appointmentDetailsStatus === FETCH_STATUS.failed && isBadAppointmentId) {
    return (
      <PageLayout showNeedHelp>
        <br />
        <div aria-atomic="true" aria-live="assertive">
          <InfoAlert
            status="error"
            level={1}
            headline="We’re sorry, we can't find your appointment"
          >
            Try searching this appointment on your appointment list or call your
            facility.
            <p className="vads-u-margin-y--0p5">
              <va-link
                data-testid="view-claim-link"
                href="/my-health/appointments"
                text="Go to appointments"
              />
            </p>
          </InfoAlert>
        </div>
      </PageLayout>
    );
  }
  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <PageLayout showBreadcrumbs showNeedHelp>
        <AppointmentDetailsErrorMessage />
      </PageLayout>
    );
  }
  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  return (
    <PageLayout showNeedHelp>
      {isVA && (
        <DetailsVA appointment={appointment} facilityData={facilityData} />
      )}
      {isCommunityCare && <CCLayout data={appointment} />}
      {isVideo && <VideoLayout data={appointment} />}
    </PageLayout>
  );
}
