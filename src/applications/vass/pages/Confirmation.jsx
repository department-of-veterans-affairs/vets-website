import React from 'react';
import {
  useParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import { useGetAppointmentQuery } from '../redux/api/vassApi';
import { selectSelectedTopics, setFlowType } from '../redux/slices/formSlice';
import { FLOW_TYPES, URLS } from '../utils/constants';
import { isServerError, isAppointmentNotFoundError } from '../utils/errors';

const Confirmation = () => {
  const { appointmentId } = useParams();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const selectedTopics = useSelector(selectSelectedTopics);
  const detailsCardOnly = searchParams.get('details') === 'true';
  const navigate = useNavigate();
  const {
    data: appointmentData,
    isLoading,
    error: appointmentError,
  } = useGetAppointmentQuery({
    appointmentId,
  });

  const handleCancelAppointment = () => {
    dispatch(setFlowType(FLOW_TYPES.CANCEL));
    navigate(`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`);
  };

  return (
    <Wrapper
      testID="confirmation-page"
      disableBeforeUnload
      showBackLink={detailsCardOnly}
      loading={isLoading}
      loadingMessage="Loading appointment details. This may take up to 30 seconds. Please don’t refresh the page."
      pageTitle={
        detailsCardOnly
          ? undefined
          : 'Your VA Solid Start appointment is scheduled'
      }
      errorAlert={
        isServerError(appointmentError) ||
        isAppointmentNotFoundError(appointmentError)
      }
    >
      {!detailsCardOnly && (
        <p
          data-testid="confirmation-message"
          className="vads-u-margin-bottom--5"
        >
          We’ve confirmed your appointment.
        </p>
      )}
      <AppointmentCard
        appointmentData={{
          ...appointmentData,
          topics: appointmentData?.topics || selectedTopics,
        }}
        handleCancelAppointment={handleCancelAppointment}
        showAddToCalendarButton
      />
    </Wrapper>
  );
};

export default Confirmation;
