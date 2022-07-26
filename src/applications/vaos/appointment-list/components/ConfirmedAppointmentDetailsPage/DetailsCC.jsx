import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacilityAddress from '../../../components/FacilityAddress';
import AppointmentDateTime from '../AppointmentDateTime';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CalendarLink from './CalendarLink';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import RescheduleOrCancelAlert from './RescheduleOrCancelAlert';
import ProviderName from './ProviderName';
import { getTypeOfCareById } from '../../../utils/appointment';

export default function DetailsCC({ appointment, useV2 = false }) {
  const header = 'Community care';
  const typeOfCare = getTypeOfCareById(appointment.vaos.apiData.serviceType);

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
      <ProviderName appointment={appointment} />
      <FacilityAddress
        facility={facility}
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
  useV2: PropTypes.bool,
};
