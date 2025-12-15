import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { addMinutes } from 'date-fns';
import { getCalendarData } from '../services/appointment';
import { generateICS } from '../utils/calendar';

function handleClick({ filename, ics }) {
  return () => {
    // IE11 doesn't support the download attribute, so this creates a button
    // and uses an ms blob save api
    if (window.navigator.msSaveOrOpenBlob) {
      const blob = new Blob([ics], {
        type: 'text/calendar;charset=utf-8;',
      });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }

    window.document.querySelector('#hidden-calendar-link').click();
  };
}

export default function AddToCalendarButton({ appointment, facility }) {
  const isCC = appointment?.vaos?.isCommunityCare;
  const startUtc = appointment?.start;
  const duration = appointment?.minutesDuration;
  const endUtc = addMinutes(startUtc, duration);

  const {
    additionalText,
    location,
    phone,
    providerName,
    summary = '',
    text,
  } = getCalendarData({
    appointment,
    facility,
  });
  const description = {
    text,
    phone,
    additionalText,
    ...(!isCC && { providerName }),
  };
  const ics = generateICS(summary, description, location, startUtc, endUtc);

  const filename = `${summary.replace(/\s/g, '_')}.ics`;

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
        secondary
        onClick={handleClick({
          filename,
          ics,
        })}
        data-testid="add-to-calendar-button"
      />
    </>
  );
}
AddToCalendarButton.propTypes = {
  appointment: PropTypes.object,
  facility: PropTypes.object,
};
