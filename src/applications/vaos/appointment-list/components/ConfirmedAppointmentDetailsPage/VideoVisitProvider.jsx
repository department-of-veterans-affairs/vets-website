import React from 'react';
import { getPractitionerDisplay } from '../../../services/appointment';

export default function VideoVisitProvider({ participants }) {
  if (!participants) {
    return null;
  }

  return (
    <>
      <h3 className="vaos-appts__block-label">You’ll be meeting with</h3>
      <div>{getPractitionerDisplay(participants)}</div>
    </>
  );
}
