import React from 'react';
import { getPractitionerDisplay } from '../../../../services/appointment';

export default function VideoVisitProvider({ participants }) {
  if (!participants) {
    return null;
  }

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">You’ll be meeting with</dt>
      <dd>{getPractitionerDisplay(participants)}</dd>
    </dl>
  );
}
