import React from 'react';
import { getPractitionerDisplay } from '../../../../services/appointment';

export default function VideoVisitProvider({ participants }) {
  if (!participants) {
    return null;
  }

  const practitionerDisplay = getPractitionerDisplay(participants);

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">You'll be meeting with</dt>
      <dd>{practitionerDisplay}</dd>
    </dl>
  );
}
