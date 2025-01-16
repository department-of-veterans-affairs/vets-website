import React from 'react';
import PropTypes from 'prop-types';
import FacilityAddress from '../../../components/FacilityAddress';

export default function AtlasLocation({ appointment, isPast }) {
  const { address } = appointment.videoData.atlasLocation;
  const { city, state } = address;

  const name = `ATLAS facility in ${city}, ${state}`;
  const facility = {
    name,
    address,
  };

  return (
    <div>
      <FacilityAddress facility={facility} showDirectionsLink />
      <h3
        className="vaos-appts__block-label vads-u-margin-top--2"
        data-dd-privacy="mask"
      >
        Appointment code: {appointment.videoData.atlasConfirmationCode}
      </h3>
      {!isPast && (
        <span>
          You will use this code to find your appointment using the computer
          provided at the site.
        </span>
      )}
    </div>
  );
}

AtlasLocation.propTypes = {
  appointment: PropTypes.shape({
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool.isRequired,
    }),
    videoData: PropTypes.shape({
      atlasConfirmationCode: PropTypes.string.isRequired,
      atlasLocation: PropTypes.shape({
        address: PropTypes.shape({
          line: PropTypes.array.isRequired,
          city: PropTypes.string.isRequired,
          state: PropTypes.string.isRequired,
          postalCode: PropTypes.string.isRequired,
        }),
      }),
    }),
  }),
  isPast: PropTypes.bool,
};
AtlasLocation.defaultProps = {
  appointment: {
    vaos: {
      isPastAppointment: false,
    },
    videoData: {
      atlasConfirmationCode: '',
      atlasLocation: {
        address: {
          line: [''],
          city: '',
          state: '',
          zip: '',
        },
      },
    },
  },
};
