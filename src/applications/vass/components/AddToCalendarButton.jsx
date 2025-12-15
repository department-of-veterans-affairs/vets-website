import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { addMinutes, parseISO } from 'date-fns';
import { generateICS } from '../utils/calendar';

export default function AddToCalendarButton({ appointment }) {
  const startUtc = parseISO(appointment?.dateTime);
  const minutesDuration = 30;
  const endUtc = addMinutes(startUtc, minutesDuration);

  const description = `Your representative will call you from ${
    appointment.phoneNumber
  }.`;
  const ics = generateICS(
    'Solid Start Phone Call',
    description,
    startUtc,
    endUtc,
  );

  return (
    <>
      <a
        id="hidden-calendar-link"
        href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
        className="vads-u-display--none"
        data-testid="add-to-calendar-link"
      >
        hidden
      </a>
      <VaButton
        text="Add to calendar"
        class="vass-hide-for-print"
        secondary
        onClick={() => {
          window.document.querySelector('#hidden-calendar-link').click();
        }}
        data-testid="add-to-calendar-button"
      />
    </>
  );
}
AddToCalendarButton.propTypes = {
  appointment: PropTypes.object,
};
