import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import BackLink from '../../../components/BackLink';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import AppointmentDateTime from '../AppointmentDateTime';
import CalendarLink from './CalendarLink';
import CancelLink from './CancelLink';
import StatusAlert from '../../../components/StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import VAInstructions from './VAInstructions';
import NoOnlineCancelAlert from './NoOnlineCancelAlert';
import PhoneInstructions from './PhoneInstructions';
import {
  getConfirmedAppointmentDetailsInfo,
  selectTypeOfCareName,
} from '../../redux/selectors';
import { APPOINTMENT_STATUS, FETCH_STATUS } from '../../../utils/constants';
import { formatHeader } from './DetailsVA.util';
import { selectFeatureAppointmentDetailsRedesign } from '../../../redux/selectors';
import InPersonLayout from '../../../components/layout/InPersonLayout';
import CancelWarningPage from '../cancel/CancelWarningPage';
import CancelConfirmationPage from '../cancel/CancelConfirmationPage';
import FacilityAddress from '../../../components/FacilityAddress';
import ClaimExamLayout from '../../../components/layout/ClaimExamLayout';
import PhoneLayout from '../../../components/layout/PhoneLayout';

function Content({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];
  const isCovid = appointment?.vaos?.isCOVIDVaccine;
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;
  const header = formatHeader(appointment);
  const {
    isPastAppointment,
    isCompAndPenAppointment,
    isPhoneAppointment,
    isCancellable: isAppointmentCancellable,
  } = appointment?.vaos || {};

  const featureAppointmentDetailsRedesign = useSelector(
    selectFeatureAppointmentDetailsRedesign,
  );

  // we don't want to display the appointment type header for upcoming C&P appointments.
  const displayTypeHeader =
    !isCompAndPenAppointment ||
    (isCompAndPenAppointment && (isPastAppointment || canceled));
  const ShowTypeOfCare = () => {
    const typeOfCareName = selectTypeOfCareName(appointment);

    return (
      !!typeOfCareName && (
        <>
          {isCompAndPenAppointment && !isPastAppointment && !canceled ? (
            <>
              <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
                {typeOfCareName}
              </h2>
              <p className="vads-l-col--12 vads-u-margin-top--0 medium-screen:vads-l-col--8">
                This appointment is for disability rating purposes only. It
                doesn’t include treatment. If you have medical evidence to
                support your claim, bring copies to this appointment.
              </p>
            </>
          ) : (
            !isCompAndPenAppointment && (
              <>
                <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
                  Type of care:
                </h2>
                <div className="vads-u-display--inline"> {typeOfCareName}</div>
              </>
            )
          )}
        </>
      )
    );
  };

  if (featureAppointmentDetailsRedesign) {
    if (isCompAndPenAppointment) return <ClaimExamLayout data={appointment} />;
    if (isPhoneAppointment) return <PhoneLayout data={appointment} />;
    return <InPersonLayout data={appointment} />;
  }

  return (
    <>
      <BackLink appointment={appointment} />
      <h1 className="vads-u-margin-y--2p5">
        <AppointmentDateTime appointment={appointment} />
      </h1>
      <StatusAlert appointment={appointment} facility={facility} />
      <ShowTypeOfCare />
      {displayTypeHeader && <TypeHeader>{header}</TypeHeader>}
      {!isPastAppointment && <PhoneInstructions appointment={appointment} />}
      <VAFacilityLocation
        facility={facility}
        facilityName={facility?.name}
        facilityId={locationId}
        clinicFriendlyName={appointment.location?.clinicName}
        clinicPhysicalLocation={appointment.location?.clinicPhysicalLocation}
        showCovidPhone={isCovid}
        isPhone={isPhoneAppointment}
      />
      <VAInstructions appointment={appointment} />
      <CalendarLink appointment={appointment} facility={facility} />
      <PrintLink appointment={appointment} />
      {isAppointmentCancellable && <CancelLink appointment={appointment} />}
      {!isAppointmentCancellable && (
        <NoOnlineCancelAlert appointment={appointment} facility={facility} />
      )}
    </>
  );
}
Content.propTypes = {
  appointment: PropTypes.object,
  facilityData: PropTypes.object,
};

export default function DetailsVA({ appointment, facilityData }) {
  const { id } = useParams();
  const { cancelInfo, isCC } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const featureAppointmentDetailsRedesign = useSelector(
    selectFeatureAppointmentDetailsRedesign,
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

  if (featureAppointmentDetailsRedesign) {
    if (cancelInfo.showCancelModal === false) {
      return <Content appointment={appointment} facilityData={facilityData} />;
    }
    if (
      cancelInfo.cancelAppointmentStatus === FETCH_STATUS.notStarted ||
      cancelInfo.cancelAppointmentStatus === FETCH_STATUS.loading
    ) {
      return <CancelWarningPage {...data} />;
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

  return <Content appointment={appointment} facilityData={facilityData} />;
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
      clinicName: PropTypes.string.isRequired,
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
