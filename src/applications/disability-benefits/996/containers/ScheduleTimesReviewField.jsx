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
    <dl className="review-row">
      <dt>
        <span className="time-contact" role="presentation">
          {label}
        </span>
      </dt>
      <dd>{timeSlot}</dd>
    </dl>
  );
}
