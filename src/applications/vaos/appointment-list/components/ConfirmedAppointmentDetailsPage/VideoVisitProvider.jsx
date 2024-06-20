import React from 'react';
import PropTypes from 'prop-types';

export default function VideoVisitProvider({ appointment }) {
  const { providers } = appointment.videoData;

  if (!providers?.length) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--2">
      <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
        {!appointment.vaos.isPastAppointment
          ? 'You’ll be meeting with'
          : 'You met with'}
      </h2>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="usa-unstyled-list" role="list">
        {providers.map((provider, index) => (
          <li key={index}>{provider.display}</li>
        ))}
      </ul>
    </div>
  );
}

VideoVisitProvider.propTypes = {
  appointment: PropTypes.shape({
    status: PropTypes.string.isRequired,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool.isRequired,
    }),
    videoData: PropTypes.shape({
      providers: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
  }),
};

VideoVisitProvider.defaultProps = {
  appointment: {
    status: '',
    vaos: {
      isPastAppointment: false,
    },
    videoData: {
      providers: [],
    },
  },
};
