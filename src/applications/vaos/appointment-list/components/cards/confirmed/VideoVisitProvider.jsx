import React from 'react';
import { getPractitionerDisplay } from '../../../../services/appointment';

export default function VideoVisitProvider({ participants }) {
  if (!participants) {
    return null;
  }

  return (
    <>
      <h4 className="vads-u-font-weight--bold">You’ll be meeting with</h4>
      <div>{getPractitionerDisplay(participants)}</div>
    </>
  );
}
