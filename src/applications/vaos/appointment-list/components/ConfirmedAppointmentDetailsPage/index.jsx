import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import VideoLayout from '../../../components/layout/VideoLayout';
import moment from '../../../lib/moment-tz';
import {
  selectFeatureAppointmentDetailsRedesign,
  selectFeatureBreadcrumbUrlUpdate,
  selectFeatureVaosV2Next,
} from '../../../redux/selectors';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { fetchConfirmedAppointmentDetails } from '../../redux/actions';
import {
  getConfirmedAppointmentDetailsInfo,
  selectIsCanceled,
  selectIsInPerson,
  selectIsPast,
} from '../../redux/selectors';
import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import PageLayout from '../PageLayout';
import DetailsCC from './DetailsCC';
import DetailsVA from './DetailsVA';
import DetailsVideo from './DetailsVideo';

export default function ConfirmedAppointmentDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
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
  const featureVaosV2Next = useSelector(state =>
    selectFeatureVaosV2Next(state),
  );
  const featureAppointmentDetailsRedesign = useSelector(
    selectFeatureAppointmentDetailsRedesign,
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
    },
    [id, dispatch, appointmentTypePrefix],
  );

  useEffect(
    () => {
      let pageTitle;
      let prefix = null;

      if (isPast) prefix = 'Past';
      else if (isCanceled) prefix = 'Canceled';

      if (isCommunityCare)
        pageTitle = prefix ? `${prefix} community care` : 'Community care';
      else if (isInPerson) {
        if (appointment?.vaos?.isCompAndPenAppointment)
          pageTitle = prefix ? `${prefix} claim exam` : 'Claim exam';
        else pageTitle = prefix ? `${prefix} in-person` : 'In-person';
      }

      const pageTitleSuffix = featureBreadcrumbUrlUpdate
        ? ' | Veterans Affairs'
        : '';
      if (appointment && appointmentDate) {
        document.title = `${pageTitle} appointment on ${appointmentDate.format(
          'dddd, MMMM DD, YYYY',
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

  if (featureAppointmentDetailsRedesign) {
    return (
      <PageLayout showNeedHelp>
        {isVA && (
          <DetailsVA
            appointment={appointment}
            facilityData={facilityData}
            useV2={useV2}
          />
        )}
        {isCommunityCare && (
          <DetailsCC
            appointment={appointment}
            useV2={useV2}
            featureVaosV2Next={featureVaosV2Next}
          />
        )}
        {isVideo && <VideoLayout data={appointment} />}
      </PageLayout>
    );
  }

  return (
    <PageLayout showNeedHelp={featureAppointmentDetailsRedesign}>
      {isVideo && (
        <DetailsVideo appointment={appointment} facilityData={facilityData} />
      )}
      {isVA && (
        <DetailsVA
          appointment={appointment}
          facilityData={facilityData}
          useV2={useV2}
        />
      )}
      {isCommunityCare && (
        <DetailsCC
          appointment={appointment}
          useV2={useV2}
          featureVaosV2Next={featureVaosV2Next}
        />
      )}
      <CancelAppointmentModal />
    </PageLayout>
  );
}
