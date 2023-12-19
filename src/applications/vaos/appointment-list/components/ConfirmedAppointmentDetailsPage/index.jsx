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
import { selectFeatureVaosV2Next } from '../../../redux/selectors';
import DetailsVA from './DetailsVA';
import DetailsCC from './DetailsCC';
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

  const featureVaosV2Next = useSelector(state =>
    selectFeatureVaosV2Next(state),
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
      const pageTitleSuffix = ' | Veterans Affairs';
      if (appointment && appointmentDate) {
        document.title = `${pageTitle} appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}${pageTitleSuffix}`;
        scrollAndFocus();
      }
    },
    // [appointment, appointmentDate, isCommunityCare],
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
