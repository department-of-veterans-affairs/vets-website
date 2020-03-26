import React from 'react';

import {
  informalConferenceTimeAllLabels,
  InformalConferenceAvailability,
} from '../content/InformalConference';

export default function ScheduleTimesReviewField(props) {
  const { children, uiSchema } = props;

  if (!children?.props.formData) {
    // Don't render time slots that are undefined (or false)
    return null;
  }

  const contact = uiSchema?.['ui:options'].informalConferenceChoice;
  const label = InformalConferenceAvailability(contact);
  const timeSlot = informalConferenceTimeAllLabels?.[children?.props.name];

  return (
    <div className="review-row scheduled-time">
      <dt>{label}</dt>
      <dd>{timeSlot}</dd>
    </div>
  );
}
