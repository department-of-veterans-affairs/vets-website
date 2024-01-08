import React from 'react';
import PropTypes from 'prop-types';
import BackLink from '../../../components/BackLink';
import FacilityAddress from '../../../components/FacilityAddress';
import AppointmentDateTime from '../AppointmentDateTime';
import CalendarLink from './CalendarLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import RescheduleOrCancelAlert from './RescheduleOrCancelAlert';
import ProviderName from './ProviderName';
import CCInstructions from './CCInstructions';
import { getTypeOfCareById } from '../../../utils/appointment';

export default function DetailsCC({ appointment, useV2, featureVaosV2Next }) {
  const header = 'Community care provider';
  const facility = appointment.communityCareProvider;
  const typeOfCare = getTypeOfCareById(appointment.vaos.apiData.serviceType);
  const { treatmentSpecialty } = facility;
  const ShowTypeOfCare = () => {
    if (useV2 && typeOfCare) {
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
      <BackLink appointment={appointment} />
      <h1 className="vads-u-margin-y--2p5">
        <AppointmentDateTime appointment={appointment} />
      </h1>
      <StatusAlert appointment={appointment} />
      <ShowTypeOfCare />
      <TypeHeader isCC>{header}</TypeHeader>
      <ProviderName appointment={appointment} useV2={useV2} />
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
  useV2: PropTypes.bool,
};
DetailsCC.defaultProps = {
  featureVaosV2Next: false,
  useV2: false,
};
