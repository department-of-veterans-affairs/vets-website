import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackLink from '../../../components/BackLink';
import FacilityAddress from '../../../components/FacilityAddress';
import FullWidthLayout from '../../../components/FullWidthLayout';
import ClaimExamLayout from '../../../components/layouts/ClaimExamLayout';
import InPersonLayout from '../../../components/layouts/InPersonLayout';
import PhoneLayout from '../../../components/layouts/PhoneLayout';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { FETCH_STATUS } from '../../../utils/constants';
import CancelConfirmationPage from '../CancelAppointmentPage/CancelConfirmationPage';
import CancelWarningPage from '../CancelAppointmentPage/CancelWarningPage';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';

export default function DetailsVA({ appointment, facilityData }) {
  const { id } = useParams();
  const { cancelInfo, isCC } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );

  if (appointment === 'undefined' || !appointment) return null;

  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];
  const data = {
    appointment,
    cancelInfo,
    facilityData,
    isCC,
  };

  if (cancelInfo.showCancelModal === false) {
    const { isCompAndPenAppointment, isPhoneAppointment } =
      appointment?.vaos || {};

    if (isCompAndPenAppointment) return <ClaimExamLayout data={appointment} />;
    if (isPhoneAppointment) return <PhoneLayout data={appointment} />;
    return <InPersonLayout data={appointment} />;
  }

  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.notStarted) {
    return <CancelWarningPage {...data} />;
  }
  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Canceling your appointment..."
        />
      </FullWidthLayout>
    );
  }
  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded) {
    return (
      <CancelConfirmationPage
        appointment={appointment}
        cancelInfo={cancelInfo}
      />
    );
  }
  if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.failed) {
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
            {isCC && (
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
              !isCC && (
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
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    comment: PropTypes.string,
    status: PropTypes.string.isRequired,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool,
      isUpcomingAppointment: PropTypes.bool,
      isPendingAppointment: PropTypes.bool,
      isCompAndPenAppointment: PropTypes.bool,
      isCOVIDVaccine: PropTypes.bool,
      isPhoneAppointment: PropTypes.bool,
      isCancellable: PropTypes.bool,
    }),
    location: PropTypes.shape({
      vistaId: PropTypes.string.isRequired,
      clinicId: PropTypes.string,
      stationId: PropTypes.string.isRequired,
      clinicName: PropTypes.string,
      clinicPhysicalLocation: PropTypes.string,
    }),
  }),
  facilityData: PropTypes.shape({
    locationId: PropTypes.shape({
      id: PropTypes.string.isRequired,
      vistaId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
};

DetailsVA.defaultProps = {
  appointment: {
    id: '',
    start: '',
    comment: '',
    vaos: {
      isPastAppointment: false,
      isUpcomingAppointment: false,
      isPendingAppointment: false,
      isVideo: false,
      isAtlas: false,
      extension: { patientHasMobileGfe: false },
      kind: '',
    },
    location: {
      vistaId: '',
      clinicId: '',
      stationId: '',
      clinicName: '',
      clinicPhysicalLocation: '',
    },
  },
  facilityData: {
    locationId: {
      id: '',
      vistaId: '',
      name: '',
    },
  },
};
