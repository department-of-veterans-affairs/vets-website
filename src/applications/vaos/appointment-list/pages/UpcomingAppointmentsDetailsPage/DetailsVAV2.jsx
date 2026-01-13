import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import BackLink from '../../../components/BackLinkV2';
import FacilityAddress from '../../../components/FacilityAddress';
import FullWidthLayout from '../../../components/FullWidthLayout';
import ClaimExamLayout from '../../../components/layouts/ClaimExamLayoutV2';
import InPersonLayout from '../../../components/layouts/InPersonLayoutV2';
import PhoneLayout from '../../../components/layouts/PhoneLayoutV2';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { useCancelAppointmentMutation } from '../../../services/appointment/apiSlice';
import CancelConfirmationPage from '../CancelAppointmentPage/CancelConfirmationPageV2';
import CancelWarningPage from '../CancelAppointmentPage/CancelWarningPageV2';

export default function DetailsVA({ appointment }) {
  const { id } = useParams();
  const [isCancelAppointment, setIsCancelAppointment] = React.useState(false);
  const { isError, isLoading, isSuccess } = useCancelAppointmentMutation(id);
  const {
    isCommunityCare,
    isCompAndPenAppointment,
    isPhoneAppointment,
    location: facility,
  } = appointment;

  if (isCancelAppointment === false) {
    if (isCompAndPenAppointment) return <ClaimExamLayout data={appointment} />;
    if (isPhoneAppointment) return <PhoneLayout data={appointment} />;

    return <InPersonLayout data={appointment} />;
  }

  if (isCancelAppointment) {
    return (
      <CancelWarningPage
        appointment={appointment}
        setIsDisplay={setIsCancelAppointment}
      />
    );
  }
  if (isCancelAppointment && isLoading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Canceling your appointment..."
        />
      </FullWidthLayout>
    );
  }

  if (isCancelAppointment && isSuccess) {
    return <CancelConfirmationPage appointment={appointment} />;
  }

  if (isCancelAppointment && isError) {
    return (
      <>
        <BackLink appointment={appointment} />
        <div className="vads-u-margin-y--2p5">
          <VaAlert status="error" visible>
            <h2 slot="headline">We couldn’t cancel your appointment</h2>
            <p>
              Something went wrong when we tried to cancel this appointment.
              Please contact your medical center to cancel:
            </p>
            <br />
            <br />
            {isCommunityCare && (
              <>
                <strong>{facility?.name}</strong>
                <br />
                <FacilityAddress
                  facility={facility}
                  showPhone
                  phoneHeading="Scheduling facility phone:"
                />
              </>
            )}
            {!!facility &&
              !isCommunityCare && (
                <VAFacilityLocation
                  facility={facility}
                  facilityName={facility?.name}
                  facilityId={facility?.id}
                  isPhone
                  showDirectionsLink={false}
                />
              )}
          </VaAlert>
        </div>
      </>
    );
  }
}

DetailsVA.propTypes = {
  appointment: PropTypes.object,
  facilityData: PropTypes.object,
};
