import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import BackLink from '../../../components/BackLink';
import FacilityAddress from '../../../components/FacilityAddress';
import FullWidthLayout from '../../../components/FullWidthLayout';
import ClaimExamLayout from '../../../components/layouts/ClaimExamLayout';
import InPersonLayout from '../../../components/layouts/InPersonLayout';
import PhoneLayout from '../../../components/layouts/PhoneLayout';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { selectCancelInfo } from '../../../services/appointment/apiSlice';
import { FETCH_STATUS } from '../../../utils/constants';
import CancelConfirmationPage from '../CancelAppointmentPage/CancelConfirmationPage';
import CancelWarningPage from '../CancelAppointmentPage/CancelWarningPage';

export default function DetailsVA({ appointment, facilityData }) {
  const cancelInfo = useSelector(selectCancelInfo);

  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];
  const data = {
    appointment,
    cancelInfo,
    facilityData,
    isCC: appointment.isCommunityCare,
  };

  if (cancelInfo?.showCancelModal === false) {
    const { isCompAndPenAppointment, isPhoneAppointment } = appointment;

    if (isCompAndPenAppointment) return <ClaimExamLayout data={appointment} />;
    if (isPhoneAppointment) return <PhoneLayout data={appointment} />;
    return <InPersonLayout data={appointment} />;
  }

  if (cancelInfo?.cancelAppointmentStatus === FETCH_STATUS.notStarted) {
    return <CancelWarningPage {...data} />;
  }
  if (cancelInfo?.cancelAppointmentStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Canceling your appointment..."
        />
      </FullWidthLayout>
    );
  }
  if (cancelInfo?.cancelAppointmentStatus === FETCH_STATUS.succeeded) {
    return (
      <CancelConfirmationPage
        appointment={appointment}
        cancelInfo={cancelInfo}
      />
    );
  }
  if (cancelInfo?.cancelAppointmentStatus === FETCH_STATUS.failed) {
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
            {appointment.isCommunityCare && (
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
              !appointment.isCommunityCare && (
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
  appointment: PropTypes.object.isRequired,
  facilityData: PropTypes.object,
};
