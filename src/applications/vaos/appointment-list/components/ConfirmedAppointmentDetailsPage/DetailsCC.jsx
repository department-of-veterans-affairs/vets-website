import React from 'react';
import PropTypes from 'prop-types';
import BackLink from '../../../components/BackLink';
import FacilityAddress from '../../../components/FacilityAddress';
import AppointmentDateTime from '../AppointmentDateTime';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CalendarLink from './CalendarLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import RescheduleOrCancelAlert from './RescheduleOrCancelAlert';
import ProviderName from './ProviderName';
import CCInstructions from './CCInstructions';
import { getTypeOfCareById } from '../../../utils/appointment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

export default function DetailsCC({ appointment, featureVaosV2Next = false }) {
  const header = 'Community care provider';
  const facility = appointment.communityCareProvider;
  const typeOfCare = getTypeOfCareById(appointment.vaos.apiData.serviceType);
  const { treatmentSpecialty } = facility;
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const showBackLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink,
  );
  const ShowTypeOfCare = () => {
    if (typeOfCare) {
      return (
        <>
          <h2
            className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
            data-cy="community-care-appointment-details-header"
          >
            <div className="vads-u-display--inline">Type of care</div>
          </h2>
          <div>{typeOfCare?.name}</div>
        </>
      );
    }
    return null;
  };

  const ShowTreatmentSpecialty = () => {
    if (featureVaosV2Next && !!treatmentSpecialty) {
      return (
        <div
          data-testid="appointment-treatment-specialty"
          className="vads-u-margin-bottom--1"
        >
          {treatmentSpecialty}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {showBackLink ? (
        <BackLink appointment={appointment} />
      ) : (
        <Breadcrumbs>
          <a
            href={`/health-care/schedule-view-va-appointments/appointments/va/${
              appointment.id
            }`}
          >
            Appointment detail
          </a>
        </Breadcrumbs>
      )}
      <h1 className="vads-u-margin-y--2p5">
        <AppointmentDateTime appointment={appointment} />
      </h1>
      <StatusAlert appointment={appointment} />
      <ShowTypeOfCare />
      <TypeHeader isCC>{header}</TypeHeader>
      <ProviderName appointment={appointment} />
      <ShowTreatmentSpecialty />
      <FacilityAddress
        facility={facility}
        showDirectionsLink={!!appointment.communityCareProvider?.address}
        level={2}
      />

      <CCInstructions appointment={appointment} />
      <CalendarLink appointment={appointment} facility={facility} />
      <PrintLink appointment={appointment} />
      <RescheduleOrCancelAlert appointment={appointment} />
    </>
  );
}

DetailsCC.propTypes = {
  appointment: PropTypes.object.isRequired,
  featureVaosV2Next: PropTypes.bool,
};
