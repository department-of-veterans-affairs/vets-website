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

const Confirmation = () => {
  const { appointmentId } = useParams();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const selectedTopics = useSelector(selectSelectedTopics);
  const detailsCardOnly = searchParams.get('details') === 'true';
  const navigate = useNavigate();
  const { data: appointmentData, isLoading, isError } = useGetAppointmentQuery({
    appointmentId,
  });

  const handleCancelAppointment = () => {
    dispatch(setFlowType(FLOW_TYPES.CANCEL));
    navigate(`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`);
  };

  if (isLoading) {
    // TODO: is there a loading screen?
    return null;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Wrapper
      testID="confirmation-page"
      showBackLink={detailsCardOnly}
      pageTitle={
        detailsCardOnly
          ? undefined
          : 'Your VA Solid Start appointment is scheduled'
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
