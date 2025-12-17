import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../../../components/FullWidthLayout';
import ClaimExamLayout from '../../../components/layouts/ClaimExamLayoutV2';
import InPersonLayout from '../../../components/layouts/InPersonLayoutV2';
import PhoneLayout from '../../../components/layouts/PhoneLayoutV2';
import { useCancelAppointmentMutation } from '../../../services/appointment/apiSlice';
import CancelConfirmationPage from '../CancelAppointmentPage/CancelConfirmationPage';
import CancelWarningPage from '../CancelAppointmentPage/CancelWarningPageV2';

export default function DetailsVA({ appointment }) {
  const { id } = useParams();
  // const [skip, setSkip] = React.useState(true);
  const [isCancelAppointment, setIsCancelAppointment] = React.useState(false);
  const { isError, isLoading, isSuccess } = useCancelAppointmentMutation(id, {
    skip: !isCancelAppointment,
  });

  // if (appointment === 'undefined' || !appointment) return null;

  //   const locationId = getVAAppointmentLocationId(appointment);
  //   const facility = facilityData?.[locationId];
  //   const data = {
  //     appointment,
  //     cancelInfo,
  //     facilityData,
  //     isCC,
  //   };

  if (isCancelAppointment === false) {
    const { isCompAndPenAppointment, isPhoneAppointment } =
      appointment?.vaos || {};

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
    return <h1>Error!!!!</h1>;
    //     return (
    //       <>
    //         <BackLink appointment={appointment} />
    //         <div className="vads-u-margin-y--2p5">
    //           <VaAlert status="error" visible>
    //             <h2 slot="headline">We couldn’t cancel your appointment</h2>
    //             <p>
    //               Something went wrong when we tried to cancel this appointment.
    //               Please contact your medical center to cancel:
    //             </p>
    //             <br />
    //             <br />
    //             {isCC && (
    //               <>
    //                 <strong>{facility?.name}</strong>
    //                 <br />
    //                 <FacilityAddress
    //                   facility={facility}
    //                   showPhone
    //                   phoneHeading="Scheduling facility phone:"
    //                 />
    //               </>
    //             )}
    //             {!!facility &&
    //               !isCC && (
    //                 <VAFacilityLocation
    //                   facility={facility}
    //                   facilityName={facility?.name}
    //                   facilityId={facility?.id}
    //                   isPhone
    //                   showDirectionsLink={false}
    //                 />
    //               )}
    //           </VaAlert>
    //         </div>
    //       </>
    //     );
  }
}

DetailsVA.propTypes = {
  appointment: PropTypes.object,
  facilityData: PropTypes.object,
};
