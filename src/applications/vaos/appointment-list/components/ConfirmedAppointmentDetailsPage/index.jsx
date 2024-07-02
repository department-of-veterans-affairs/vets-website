import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import moment from '../../../lib/moment-tz';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import PageLayout from '../PageLayout';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import { fetchConfirmedAppointmentDetails } from '../../redux/actions';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';
import {
  selectFeatureAppointmentDetailsRedesign,
  selectFeatureBreadcrumbUrlUpdate,
  selectFeatureVaosV2Next,
} from '../../../redux/selectors';
import DetailsVA from './DetailsVA';
import DetailsCC from './DetailsCC';
import DetailsVideo from './DetailsVideo';
import VideoLayout from '../../../components/layout/VideoLayout';

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
      const pageTitle = isCommunityCare ? 'Community care' : 'VA';
      const pageTitleSuffix = featureBreadcrumbUrlUpdate
        ? ' | Veterans Affairs'
        : '';
      if (appointment && appointmentDate) {
        document.title = `${pageTitle} appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}${pageTitleSuffix}`;
        scrollAndFocus();
      }
    },
    // [appointment, appointmentDate, isCommunityCare, featureBreadcrumbUrlUpdateæ],
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
