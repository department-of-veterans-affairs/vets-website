import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

const parseVistaDateTime = date => {
  return parse(date, 'MM/dd/yyyy@HH:mm', new Date());
};

const parseVistaDate = date => {
  return parse(date, 'MM/dd/yyyy', new Date());
};

const stripDst = (timeZone, shortTimezone) => {
  if (/^(America|US\/)/.test(timeZone) && /^[PMCE][DS]T$/.test(shortTimezone)) {
    return shortTimezone.replace('ST', 'T').replace('DT', 'T');
  }

  return shortTimezone;
};

const getShortTimezone = avs => {
  const { timeZone } = avs.meta;

  const options = { timeZone, timeZoneName: 'short' };
  const shortTimezone = new Intl.DateTimeFormat('en-US', options)
    .format(utcToZonedTime(new Date(), timeZone))
    .split(' ')[1];

  // Strip out middle char in short timezone.
  return stripDst(timeZone, shortTimezone);
};

const getFormattedAppointmentTime = twentyFourHourTime => {
  const time = parse(twentyFourHourTime, 'HH:mm', new Date());
  return format(time, 'H:mm aaaa');
};

const getFormattedAppointmentDate = avs => {
  return formatDateLong(parseVistaDateTime(avs.appointments[0]?.datetime));
};

const getFormattedGenerationDate = avs => {
  const { generatedDate, timeZone } = avs.meta;
  const zonedDate = utcToZonedTime(generatedDate, timeZone);
  const shortTimeZone = getShortTimezone(avs);

  return `${format(
    zonedDate,
    "MMMM d, yyyy' at 'h:mm aaaaa'.m.'",
    timeZone,
  )} ${shortTimeZone}`;
};

export {
  getFormattedAppointmentDate,
  getFormattedAppointmentTime,
  getFormattedGenerationDate,
  getShortTimezone,
  parseVistaDate,
  parseVistaDateTime,
};
