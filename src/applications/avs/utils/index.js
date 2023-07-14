import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

const getFormattedAppointmentDate = avs => {
  return formatDateLong(
    parse(avs.data.appointments[0]?.datetime, 'MM/dd/yyyy@HH:mm', new Date()),
  );
};

const getFormattedGenerationDate = avs => {
  const { timeZone } = avs.data.header;
  const zonedDate = utcToZonedTime(avs.generatedDate, timeZone);

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

export { getFormattedAppointmentDate, getFormattedGenerationDate };
