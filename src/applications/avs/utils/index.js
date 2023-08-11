import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

const parseVistaDateTime = date => {
  return parse(date, 'MM/dd/yyyy@HH:mm', new Date());
};

const parseVistaDate = date => {
  return parse(date, 'MM/dd/yyyy', new Date());
};

const getFormattedAppointmentDate = avs => {
  return formatDateLong(parseVistaDateTime(avs.appointments[0]?.datetime));
};

const getFormattedGenerationDate = avs => {
  const { generatedDate, timeZone } = avs.meta;
  const zonedDate = utcToZonedTime(generatedDate, timeZone);

  const options = {
    timeZone,
    timeZoneName: 'short',
  };
  const shortTimeZone = new Intl.DateTimeFormat('en-US', options)
    .format(zonedDate)
    .split(' ')[1];

  return `${format(
    zonedDate,
    "MMMM d, yyyy' at 'h:mm aaaaa'.m.'",
    timeZone,
  )} ${shortTimeZone}`;
};

export {
  getFormattedAppointmentDate,
  getFormattedGenerationDate,
  parseVistaDate,
  parseVistaDateTime,
};
