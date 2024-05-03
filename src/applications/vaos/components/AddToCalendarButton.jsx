import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
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
  const isCC = appointment.vaos.isCommunityCare;
  const startDate = moment.parseZone(appointment?.start);
  const duration = appointment?.minutesDuration;

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
  const ics = generateICS(
    summary,
    description,
    location,
    startDate,
    moment(startDate).add(duration, 'minutes'),
  );

  const filename = `${summary.replace(/\s/g, '_')}.ics`;
  const formattedDate = moment.parseZone(startDate).format('MMMM D, YYYY');

  return (
    <>
      <a
        id="hidden-calendar-link"
        href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
        className="vads-u-display--none"
      >
        hidden
      </a>
      <VaButton
        text="Add to calendar"
        label={`Add ${formattedDate} appointment to your calendar`}
        secondary
        onClick={handleClick({
          filename,
          ics,
        })}
      />
    </>
  );
}
AddToCalendarButton.propTypes = {
  appointment: PropTypes.object,
  facility: PropTypes.object,
};
