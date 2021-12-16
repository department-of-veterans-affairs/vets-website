import React, { useState } from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import { VideoVisitInstructions } from './VideoVisitInstructions';

import { isVideoHome } from '../../../services/appointment';

export default function VideoInstructionsLink({ appointment }) {
  const [showMoreOpen, setShowMoreOpen] = useState(false);

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
      <AdditionalInfo
        onClick={() => setShowMoreOpen(!showMoreOpen)}
        triggerText="Prepare for video visit"
      >
        <VideoVisitInstructions instructionsType={appointment.comment} />
      </AdditionalInfo>
    </div>
  );
}
