import React from 'react';
import PropTypes from 'prop-types';

import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

import { getFormattedAppointmentDate, parseVistaDateTime } from '../utils';
import { APPOINTMENT_TYPES } from '../utils/constants';

const getAppointments = (type, appointments) => {
  return appointments.filter(appointment => appointment.type === type.label);
};

const appointments = avs => {
  if (avs.data.appointments?.length > 0) {
    const items = getAppointments(
      APPOINTMENT_TYPES.SCHEDULED,
      avs.data.appointments,
    );
    const scheduledAppointments = items.map((item, idx) => (
      <div key={idx}>
        <h5>{formatDateLong(parseVistaDateTime(item.datetime))}</h5>
        <p>
          {item.location} ({item.physicalLocation})<br />
          Clinic location: {item.site}
        </p>
      </div>
    ));

    return (
      <div>
        <h3>Upcoming appointments</h3>
        {scheduledAppointments && (
          <div>
            <h4>Scheduled appointments</h4>
            <p>Appointments in the next 13 months:</p>
            <ul>{scheduledAppointments}</ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const primaryCareProvider = avs => {
  if (avs.data.primaryCareProviders) {
    return (
      <div>
        <h3>Primary care provider</h3>
        <ul>
          {/* TODO: Confirm that this is correct */}
          <li>{avs.data.primaryCareProviders[0]}</li>
          {avs.data.primaryCareTeam && <li>{avs.data.primaryCareTeam}</li>}
        </ul>
      </div>
    );
  }

  return null;
};

const primaryCareTeam = avs => {
  if (avs.data.primaryCareTeamMembers.length > 0) {
    const teamMembers = avs.data.primaryCareTeamMembers.map((member, idx) => (
      <li key={idx}>
        {member.name} - {member.title}
      </li>
    ));

    return (
      <div>
        <h3>Primary care team</h3>
        <ul>{teamMembers}</ul>
      </div>
    );
  }

  return null;
};

const YourHealthInformation = props => {
  const { avs } = props;
  const appointmentDate = getFormattedAppointmentDate(avs);

  return (
    <div>
      <p>
        Note: the health information in this summary is from {appointmentDate}.{' '}
        <a href="/my-health/">
          Go to the MyHealtheVet website for your current VA medical records.
        </a>
      </p>
      {primaryCareProvider(avs)}
      {primaryCareTeam(avs)}
      {appointments(avs)}
    </div>
  );
};

export default YourHealthInformation;

YourHealthInformation.propTypes = {
  avs: PropTypes.object,
};
