import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import moment from 'moment';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import VideoLayout from '../../../components/layout/VideoLayout';
import {
  selectFeatureBreadcrumbUrlUpdate,
  selectFeatureTravelPayViewClaimDetails,
} from '../../../redux/selectors';
import {
  isAtlasVideoAppointment,
  isClinicVideoAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
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
import PageLayout from '../PageLayout';
import DetailsVA from './DetailsVA';
import CCLayout from '../../../components/layout/CCLayout';

export default function ConfirmedAppointmentDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const {
    appointment,
    appointmentDetailsStatus,
    facilityData,
    useV2,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const featureFetchClaimStatus = useSelector(
    selectFeatureTravelPayViewClaimDetails,
  );
  const isInPerson = selectIsInPerson(appointment);
  const isPast = selectIsPast(appointment);
  const isCanceled = selectIsCanceled(appointment);
  const appointmentDate = moment.parseZone(appointment?.start);
  const isVideo = appointment?.vaos?.isVideo;
  const isCommunityCare = appointment?.vaos?.isCommunityCare;
  const isVA = !isVideo && !isCommunityCare;
  const fetchClaimStatus =
    featureFetchClaimStatus && location.pathname.includes('past');

  const appointmentTypePrefix = isCommunityCare ? 'cc' : 'va';

  useEffect(
    () => {
      dispatch(
        fetchConfirmedAppointmentDetails(
          id,
          appointmentTypePrefix,
          fetchClaimStatus,
        ),
      );
      scrollAndFocus();
      return () => {
        dispatch(closeCancelAppointment());
      };
    },
    [id, dispatch, appointmentTypePrefix, fetchClaimStatus],
  );

  useEffect(
    () => {
      let pageTitle = 'VA appointment on';
      let prefix = null;

      if (isPast) prefix = 'Past';
      else if (selectIsCanceled(appointment)) prefix = 'Canceled';

      if (isCommunityCare)
        pageTitle = prefix
          ? `${prefix} community care appointment on`
          : 'Community care appointment on';
      else if (isInPerson) {
        if (appointment?.vaos?.isCompAndPenAppointment)
          pageTitle = prefix
            ? `${prefix} claim exam appointment on`
            : 'Claim exam appointment on';
        else
          pageTitle = prefix
            ? `${prefix} in-person appointment on`
            : 'In-person appointment on';
      }
      if (isVideo) {
        pageTitle = prefix
          ? `${prefix} video appointment on`
          : 'Video appointment on';
        if (isClinicVideoAppointment(appointment)) {
          pageTitle = prefix
            ? `${prefix} video appointment at a VA location on`
            : 'Video appointment at a VA location on';
        }
        if (isAtlasVideoAppointment(appointment)) {
          pageTitle = prefix
            ? `${prefix} video appointment at an ATLAS location on`
            : 'Video appointment at an ATLAS location on';
        }
      } else if (isVAPhoneAppointment(appointment)) {
        pageTitle = prefix
          ? `${prefix} phone appointment on`
          : 'Phone appointment on';
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
