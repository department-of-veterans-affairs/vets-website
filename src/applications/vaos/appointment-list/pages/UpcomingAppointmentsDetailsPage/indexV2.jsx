import { formatInTimeZone } from 'date-fns-tz';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../../../components/FullWidthLayout';
import InfoAlert from '../../../components/InfoAlert';
import CCLayout from '../../../components/layouts/CCLayout';
import VideoLayout from '../../../components/layouts/VideoLayout';
import { selectFeatureUseBrowserTimezone } from '../../../redux/selectors';
import { useGetAppointmentQuery } from '../../../services/appointment/apiSlice';
import { DATE_FORMATS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import AppointmentDetailsErrorMessage from '../../components/AppointmentDetailsErrorMessage';
import PageLayout from '../../components/PageLayout';
import { closeCancelAppointment } from '../../redux/actions';
import DetailsVA from './DetailsVA';
import { useGetFacilityQuery } from '../../../services/location/apiSlice';

export default function UpcomingAppointmentsDetailsPage() {
  const [skip, setSkip] = useState(true);
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    isLoading: isLoadingAppointment,
    isSuccess,
    isError,
    data: appointment,
  } = useGetAppointmentQuery({
    id,
  });

  useEffect(
    () => {
      if (appointment) {
        setSkip(false);
      }
    },
    [appointment],
  );

  const { isLoading: isLoadingFacility, data: facility } = useGetFacilityQuery(
    {
      id: appointment?.locationId,
    },
    { skip },
  );

  const featureUseBrowserTimezone = useSelector(
    selectFeatureUseBrowserTimezone,
  );

  // const {
  //   isCanceled,
  //   isVideo,
  //   isCommunityCare,
  //   isPastAppointment,
  //   isInPersonVisit,
  // } = appointment;
  const isVA = !appointment?.isVideo && !appointment?.isCommunityCare;

  const appointmentTypePrefix = appointment?.isCommunityCare ? 'cc' : 'va';

  useEffect(
    () => {
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

      if (appointment?.isCanceled) prefix = 'Canceled';
      else if (appointment?.isPastAppointment) prefix = 'Past';

      if (appointment?.isCommunityCare)
        pageTitle = `${prefix} Community Care Appointment On`;
      if (appointment?.isInPersonVisit) {
        if (appointment?.isCompAndPenAppointment)
          pageTitle = `${prefix} Claim Exam Appointment On`;
        else pageTitle = `${prefix} In-person Appointment On`;
      }
      if (appointment?.isVideo) {
        pageTitle = `${prefix} Video Appointment On`;
        if (appointment?.isClinicVideoAppointment) {
          pageTitle = `${prefix} Video Appointment At A VA Location On`;
        }
        if (appointment?.isAtlasVideoAppointment) {
          pageTitle = `${prefix} Video Appointment At An ATLAS Location On`;
        }
      } else if (appointment?.isVAPhoneAppointment) {
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
    [appointment],
  );

  useEffect(
    () => {
      if (isError || (isSuccess && !appointment)) {
        scrollAndFocus();
      }
    },
    [appointment, isError, isSuccess],
  );

  if (isError && appointment?.isBadAppointmentId) {
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
  if (isError || (isSuccess && !appointment)) {
    return (
      <PageLayout showBreadcrumbs showNeedHelp>
        <AppointmentDetailsErrorMessage />
      </PageLayout>
    );
  }
  if (isLoadingAppointment || isLoadingFacility) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  return (
    <PageLayout showNeedHelp>
      {isVA && <DetailsVA appointment={appointment} facilityData={facility} />}
      {appointment.isCommunityCare && <CCLayout data={appointment} />}
      {appointment.isVideo && (
        <VideoLayout data={appointment} facility={facility} />
      )}
    </PageLayout>
  );
}
