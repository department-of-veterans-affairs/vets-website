import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacilityAddress from '../../../components/FacilityAddress';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import AppointmentDateTime from '../AppointmentDateTime';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CalendarLink from './CalendarLink';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import RescheduleOrCancelAlert from './RescheduleOrCancelAlert';
import { getTypeOfCareById } from '../../../utils/appointment';

export default function DetailsCC({
  appointment,
  // facilityData,
  useV2 = false,
}) {
  const locationId = getVAAppointmentLocationId(appointment);

  // const facility = facilityData?.[locationId];
  const header = 'Community care';

  const { name, practiceName, providerName } =
    appointment.communityCareProvider || {};

  const typeOfCare = getTypeOfCareById(appointment.vaos.apiData.serviceType);

  // v0 does not return a stopCode for covid as serviceType, instead we check for isCovid
  // remove the check for isCovid when we migrate entirely to v2
  const ShowTypeOfCare = () => {
    return (
      useV2 &&
      typeOfCare && (
        <>
          <h2
            className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
            data-cy="community-care-appointment-details-header"
          >
            <div className="vads-u-display--inline">Type of care</div>
          </h2>
          <div>{typeOfCare?.name}</div>
        </>
      )
    );
  };

  return (
    <>
      <Breadcrumbs>
        <Link to={`/cc/${appointment.id}`}>Appointment detail</Link>
      </Breadcrumbs>
      <h1>
        <AppointmentDateTime appointment={appointment} />
      </h1>
      <ShowTypeOfCare />
      <TypeHeader isCC>{header}</TypeHeader>

      {/* the order of display name is important to match screen name on add to calendar title */}

      {(!!providerName || !!practiceName || !!name) &&
        !useV2 && (
          // V1 displays the name from the provider object
          <>
            {providerName || practiceName || name}
            <br />
          </>
        )}
      {(!!providerName || !!practiceName || !!name) &&
        useV2 && (
          // V2 displays the first provider name from the array
          <>
            {providerName[0] || practiceName || name}
            <br />
          </>
        )}

      <FacilityAddress
        facility={appointment.communityCareProvider}
        showDirectionsLink={!!appointment.communityCareProvider?.address}
        level={2}
      />

      <div className="vads-u-margin-top--3 vaos-appts__block-label">
        {!!appointment.comment && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              Special instructions
            </h2>
            <div>{appointment.comment}</div>
          </div>
        )}
      </div>

      <CalendarLink appointment={appointment} facility={facility} />
      <PrintLink appointment={appointment} />
      <RescheduleOrCancelAlert appointment={appointment} />
    </>
  );
}

DetailsCC.propTypes = {
  appointment: PropTypes.object.isRequired,
  // facilityData: PropTypes.object.isRequired,
  useV2: PropTypes.bool,
};
