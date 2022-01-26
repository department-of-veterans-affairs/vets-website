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
import {
  closeCancelAppointment,
  confirmCancelAppointment,
  fetchConfirmedAppointmentDetails,
} from '../../redux/actions';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';
import DetailsVA from './DetailsVA';
import DetailsVideo from './DetailsVideo';

export default function ConfirmedAppointmentDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    appointment,
    appointmentDetailsStatus,
    cancelInfo,
    facilityData,
    useV2,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const appointmentDate = moment.parseZone(appointment?.start);

  useEffect(() => {
    dispatch(fetchConfirmedAppointmentDetails(id, 'va'));

    scrollAndFocus();
  }, []);

  useEffect(
    () => {
      if (appointment && appointmentDate) {
        document.title = `VA appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}`;
        scrollAndFocus();
      }
    },
    [appointment, appointmentDate],
  );

  useEffect(
    () => {
      if (
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
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
    [appointmentDetailsStatus],
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

  const isVideo = appointment.vaos.isVideo;
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isVA = !isVideo && !isCommunityCare;

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
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={() => dispatch(confirmCancelAppointment())}
        onClose={() => dispatch(closeCancelAppointment())}
      />
    </PageLayout>
  );
}
