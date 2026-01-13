import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../../../components/FullWidthLayout';
import CCRequestLayout from '../../../components/layouts/CCRequestLayout';
import VARequestLayout from '../../../components/layouts/VARequestLayoutV2';
import BackLink from '../../../components/BackLinkV2';
import FacilityAddress from '../../../components/FacilityAddress';
import FacilityPhone from '../../../components/FacilityPhone';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import {
  useCancelAppointmentMutation,
  useGetAppointmentRequestsQuery,
} from '../../../services/appointment/apiSlice';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import AppointmentDetailsErrorMessage from '../../components/AppointmentDetailsErrorMessage';
import PageLayout from '../../components/PageLayout';
import CancelConfirmationPage from '../CancelAppointmentPage/CancelConfirmationPageV2';
import CancelWarningPage from '../CancelAppointmentPage/CancelWarningPageV2';

export default function RequestedAppointmentDetailsPage() {
  const { id } = useParams();
  const [isCancelAppointment, setIsCancelAppointment] = React.useState(false);
  const {
    isError: isCancelError,
    isLoading: isCancelLoading,
    isSuccess: isCancelSuccess,
  } = useCancelAppointmentMutation(id);

  // Will select the appointment with the given id, and will only rerender if the given appointment's data changes
  const {
    appointment,
    isError,
    isFetching,
    isLoading,
    isSuccess,
  } = useGetAppointmentRequestsQuery(undefined, {
    selectFromResult: ({
      data,
      error: _error,
      isError: _isError,
      isFetching: _isFetching,
      isLoading: _isLoading,
      isSuccess: _isSuccess,
    }) => {
      return {
        appointment: data?.find(appt => appt.id === id),
        error: _error,
        isError: _isError,
        isFetching: _isFetching,
        isLoading: _isLoading,
        isSuccess: _isSuccess,
      };
    },
  });
  const { location: facility, isCanceled, isCommunityCare: isCC } =
    appointment || {};

  useEffect(
    () => {
      if (appointment) {
        let title = `${
          isCanceled ? 'Canceled Request For ' : 'Pending Request For '
        }${isCC ? 'Community Care Appointment' : 'Appointment'}`;
        title = title.concat(` | Veterans Affairs`);

        document.title = title;
      }
      scrollAndFocus();
    },
    [isCanceled, isCC, appointment],
  );

  useEffect(
    () => {
      if (
        (isCancelAppointment === false && isError) ||
        (isSuccess && !appointment)
      ) {
        scrollAndFocus();
      }
    },

    [appointment, isCancelAppointment, isError, isSuccess],
  );

  if (isFetching || isLoading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Loading your appointment request..."
        />
      </FullWidthLayout>
    );
  }

  if (isCancelAppointment) {
    return (
      <CancelWarningPage
        appointment={appointment}
        setIsDisplay={setIsCancelAppointment}
      />
    );
  }
  if (isCancelAppointment && isCancelLoading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Canceling your appointment..."
        />
      </FullWidthLayout>
    );
  }
  if (isCancelAppointment && isCancelSuccess) {
    return <CancelConfirmationPage appointment={appointment} />;
  }
  if (isCancelAppointment && isCancelError) {
    return (
      <PageLayout showNeedHelp>
        <BackLink appointment={appointment} />
        <div className="vads-u-margin-y--2p5">
          <VaAlert status="error" visible>
            <h2 slot="headline">We couldn’t cancel your request</h2>
            <p>
              Something went wrong when we tried to cancel this request. Please
              contact your medical center to cancel:
              <br />
              <br />
              {isCC && (
                <>
                  <strong>{facility?.name}</strong>
                  <br />
                  <FacilityAddress
                    facility={facility}
                    showPhone
                    phoneHeading="Facility phone:"
                  />
                </>
              )}
              {!!facility &&
                !isCC && (
                  <>
                    <VAFacilityLocation
                      facility={facility}
                      facilityName={facility.name}
                      facilityId={facility.id}
                      showDirectionsLink={false}
                      showPhone={false}
                    />
                    <br />
                    <FacilityPhone contact={facility.clinicPhone} level={3} />
                  </>
                )}
            </p>
          </VaAlert>
        </div>
      </PageLayout>
    );
  }

  if (isCancelAppointment === false && isSuccess && appointment) {
    if (isCC) return <CCRequestLayout data={appointment} />;
    return <VARequestLayout data={appointment} />;
  }

  if (
    (isCancelAppointment === false && isError) ||
    (isSuccess && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <AppointmentDetailsErrorMessage />
      </FullWidthLayout>
    );
  }

  return null;
}
