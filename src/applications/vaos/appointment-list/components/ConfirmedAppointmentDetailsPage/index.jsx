import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router-dom';

import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import moment from '../../../lib/moment-tz';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import PageLayout from '../PageLayout';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import { fetchConfirmedAppointmentDetails } from '../../redux/actions';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';
import { selectFeatureVaosV2Next } from '../../../redux/selectors';
import DetailsVA from './DetailsVA';
import DetailsCC from './DetailsCC';
import DetailsVideo from './DetailsVideo';

export default function ConfirmedAppointmentDetailsPage() {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { appointment, appointmentDetailsStatus, facilityData } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const featureVaosV2Next = useSelector(state =>
    selectFeatureVaosV2Next(state),
  );
  const appointmentDate = moment.parseZone(appointment?.start);

  const isVideo = appointment?.vaos?.isVideo;
  const isCommunityCare = !!match.path.includes('cc');
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
      if (appointment && appointmentDate) {
        document.title = `${pageTitle} appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}`;
        scrollAndFocus();
      }
    },
    [appointment, appointmentDate, isCommunityCare],
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
      <FullWidthLayout>
        <ErrorMessage level={1} />
      </FullWidthLayout>
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
    <PageLayout>
      {isVideo && (
        <DetailsVideo appointment={appointment} facilityData={facilityData} />
      )}
      {isVA && (
        <DetailsVA appointment={appointment} facilityData={facilityData} />
      )}
      {isCommunityCare && (
        <DetailsCC
          appointment={appointment}
          featureVaosV2Next={featureVaosV2Next}
        />
      )}
      <CancelAppointmentModal />
    </PageLayout>
  );
}
