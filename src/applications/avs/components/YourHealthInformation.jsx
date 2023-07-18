import React from 'react';
import PropTypes from 'prop-types';

import { getFormattedAppointmentDate } from '../utils';

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
    </div>
  );
};

export default YourHealthInformation;

YourHealthInformation.propTypes = {
  avs: PropTypes.object,
};
