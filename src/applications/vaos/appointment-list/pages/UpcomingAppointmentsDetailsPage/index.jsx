import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import InfoAlert from '../../../components/InfoAlert';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import CCLayout from '../../../components/layouts/CCLayout';
import VideoLayout from '../../../components/layouts/VideoLayout';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';
import {
  isAtlasVideoAppointment,
  isClinicVideoAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import PageLayout from '../../components/PageLayout';
import {
  closeCancelAppointment,
  fetchConfirmedAppointmentDetails,
} from '../../redux/actions';
import {
  getConfirmedAppointmentDetailsInfo,
  selectIsCanceled,
  selectIsInPerson,
  selectIsPast,
} from '../../redux/selectors';
import DetailsVA from './DetailsVA';

export default function UpcomingAppointmentsDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    appointment,
    appointmentDetailsStatus,
    isBadAppointmentId,
    facilityData,
    useV2,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const isInPerson = selectIsInPerson(appointment);
  const isPast = selectIsPast(appointment);
  const isCanceled = selectIsCanceled(appointment);
  const appointmentDate = moment.parseZone(appointment?.start);
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
    [id, dispatch, appointmentTypePrefix],
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
      const pageTitleSuffix = featureBreadcrumbUrlUpdate
        ? ' | Veterans Affairs'
        : '';

      if (appointment && appointmentDate) {
        document.title = `${pageTitle} ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}${pageTitleSuffix}`;
        scrollAndFocus();
      }
    },
    [
      appointment,
      appointmentDate,
      isCommunityCare,
      isCanceled,
      isInPerson,
      isPast,
      isVideo,
      featureBreadcrumbUrlUpdate,
    ],
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
        <ErrorMessage level={1} />
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
    <PageLayout isDetailPage showNeedHelp>
      {isVA && (
        <DetailsVA
          appointment={appointment}
          facilityData={facilityData}
          useV2={useV2}
        />
      )}
      {isCommunityCare && <CCLayout data={appointment} />}
      {isVideo && <VideoLayout data={appointment} />}
    </PageLayout>
  );
}
