import { formatInTimeZone } from 'date-fns-tz';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../../../components/FullWidthLayout';
import CCLayout from '../../../components/layouts/CCLayoutV2';
import VideoLayout from '../../../components/layouts/VideoLayoutV2';
import { selectFeatureUseBrowserTimezone } from '../../../redux/selectors';
import { useGetAppointmentsQuery } from '../../../services/appointment/apiSlice';
import { DATE_FORMATS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import AppointmentDetailsErrorMessage from '../../components/AppointmentDetailsErrorMessage';
import PageLayout from '../../components/PageLayout';
import { closeCancelAppointment } from '../../redux/actions';
import DetailsVA from './DetailsVAV2';

export default function UpcomingAppointmentsDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Will select the appointment with the given id, and will only rerender if the given appointment's data changes
  const {
    appointment,
    isError,
    isLoading,
    isSuccess,
  } = useGetAppointmentsQuery(undefined, {
    selectFromResult: ({
      data,
      error: _error,
      isError: _isError,
      isFetching,
      isLoading: _isLoading,
      isSuccess: _isSuccess,
    }) => {
      return {
        appointment: data?.find(appt => appt.id === id),
        error: _error,
        isError: _isError,
        isFetching,
        isLoading: _isLoading,
        isSuccess: _isSuccess,
      };
    },
  });

  const featureUseBrowserTimezone = useSelector(
    selectFeatureUseBrowserTimezone,
  );
  const {
    isAtlasVideoAppointment,
    isCanceled,
    isClinicVideoAppointment,
    isCommunityCare,
    isCompAndPenAppointment,
    isInPerson,
    isPastAppointment: isPast,
    isVAPhoneAppointment,
    isVideo,
  } = appointment || {};
  const isVA = !isVideo && !isCommunityCare;

  const appointmentTypePrefix = isCommunityCare ? 'cc' : 'va';

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

      if (isCanceled) prefix = 'Canceled';
      else if (isPast) prefix = 'Past';

      if (isCommunityCare)
        pageTitle = `${prefix} Community Care Appointment On`;
      if (isInPerson) {
        if (isCompAndPenAppointment)
          pageTitle = `${prefix} Claim Exam Appointment On`;
        else pageTitle = `${prefix} In-person Appointment On`;
      }
      if (isVideo) {
        pageTitle = `${prefix} Video Appointment On`;
        if (isClinicVideoAppointment) {
          pageTitle = `${prefix} Video Appointment At A VA Location On`;
        }
        if (isAtlasVideoAppointment) {
          pageTitle = `${prefix} Video Appointment At An ATLAS Location On`;
        }
      } else if (isVAPhoneAppointment) {
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
    [
      appointment,
      isCommunityCare,
      isCanceled,
      isInPerson,
      isPast,
      isVideo,
      isVAPhoneAppointment,
      isCompAndPenAppointment,
      isClinicVideoAppointment,
      isAtlasVideoAppointment,
    ],
  );

  useEffect(
    () => {
      if (isError || (isSuccess && !appointment)) {
        scrollAndFocus();
      }
    },
    [appointment, isError, isSuccess],
  );
  // if (isError && isBadAppointmentId) {
  //   return (
  //     <PageLayout showNeedHelp>
  //       <br />
  //       <div aria-atomic="true" aria-live="assertive">
  //         <InfoAlert
  //           status="error"
  //           level={1}
  //           headline="We’re sorry, we can't find your appointment"
  //         >
  //           Try searching this appointment on your appointment list or call your
  //           facility.
  //           <p className="vads-u-margin-y--0p5">
  //             <va-link
  //               data-testid="view-claim-link"
  //               href="/my-health/appointments"
  //               text="Go to appointments"
  //             />
  //           </p>
  //         </InfoAlert>
  //       </div>
  //     </PageLayout>
  //   );
  // }
  if (isError || (isSuccess && !appointment)) {
    return (
      <PageLayout showBreadcrumbs showNeedHelp>
        <AppointmentDetailsErrorMessage />
      </PageLayout>
    );
  }
  if (!appointment || isLoading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  return (
    <PageLayout showNeedHelp>
      {isVA && (
        <DetailsVA
          appointment={appointment}
          facilityData={appointment?.location}
        />
      )}
      {isCommunityCare && <CCLayout data={appointment} />}
      {isVideo && <VideoLayout data={appointment} />}
    </PageLayout>
  );
}
