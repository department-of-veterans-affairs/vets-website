import React from 'react';
import { getPractitionerDisplay } from '../../../../services/appointment';

export default function VideoVisitProvider({ participants }) {
  if (!participants) {
    return null;
  }

  return (
    <>
      <h4 className="vaos-appts__block-label">You’ll be meeting with</h4>
      <div>{getPractitionerDisplay(participants)}</div>
    </>
  );
}
