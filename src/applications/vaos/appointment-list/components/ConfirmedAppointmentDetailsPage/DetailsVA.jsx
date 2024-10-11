import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import BackLink from '../../../components/BackLink';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';
import { FETCH_STATUS } from '../../../utils/constants';
import InPersonLayout from '../../../components/layout/InPersonLayout';
import CancelWarningPage from '../cancel/CancelWarningPage';
import CancelConfirmationPage from '../cancel/CancelConfirmationPage';
import FacilityAddress from '../../../components/FacilityAddress';
import ClaimExamLayout from '../../../components/layout/ClaimExamLayout';
import PhoneLayout from '../../../components/layout/PhoneLayout';
import FullWidthLayout from '../../../components/FullWidthLayout';

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
            </p>
          </VaAlert>
        </div>
      </>
    );
  }
}

DetailsVA.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string.isRequired,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool.isRequired,
      isUpcomingAppointment: PropTypes.bool.isRequired,
      isPendingAppointment: PropTypes.bool.isRequired,
      isCompAndPenAppointment: PropTypes.bool.isRequired,
      isCOVIDVaccine: PropTypes.bool.isRequired,
      isPhoneAppointment: PropTypes.bool.isRequired,
      isCancellable: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      vistaId: PropTypes.string.isRequired,
      clinicId: PropTypes.string.isRequired,
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
