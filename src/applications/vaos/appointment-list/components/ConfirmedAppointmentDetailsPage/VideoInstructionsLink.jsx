import React from 'react';
import PropTypes from 'prop-types';
import { VideoVisitInstructions } from './VideoVisitInstructions';

import { isVideoHome } from '../../../services/appointment';

export default function VideoInstructionsLink({ appointment }) {
  const { isAtlas } = appointment.videoData;
  const isHome = isVideoHome(appointment);
  const showVideoInstructions =
    !!appointment.comment &&
    (isHome || isAtlas) &&
    !appointment.vaos.isPastAppointment;
  if (!showVideoInstructions) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--2">
      <va-additional-info trigger="Prepare for video visit" uswds>
        <VideoVisitInstructions instructionsType={appointment.comment} />
      </va-additional-info>
    </div>
  );
}

VideoInstructionsLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};
