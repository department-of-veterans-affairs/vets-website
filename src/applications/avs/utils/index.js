import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

const parseProblemDateTime = dateString => {
  // Parse dates in the format "Thu Apr 07 00:00:00 PDT 2005"

  // Extract the month, day, and year
  const parts = dateString.split(' ');
  const month = parts[1];
  const day = parseInt(parts[2], 10);
  const year = parseInt(parts[5], 10);

  return new Date(`${month} ${day}, ${year}`);
};

const parseVistaDateTime = date => {
  return parse(date, 'MM/dd/yyyy@HH:mm', new Date());
};

const parseVistaDate = date => {
  return parse(date, 'MM/dd/yyyy', new Date());
};

const formatImmunizationDate = date => {
  try {
    return formatDateLong(parseVistaDate(date));
  } catch {
    // Not all dates returned by AVS are valid.
    return 'N/A';
  }
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
  return format(time, 'h:mm aaaa');
};

const getFormattedAppointmentDate = avs => {
  if (!avs.clinicsVisited?.[0]?.date) return '';
  return formatDateLong(
    parseVistaDateTime(
      `${avs.clinicsVisited?.[0]?.date}@${avs.clinicsVisited?.[0]?.time}`,
    ),
  );
};

const getFormattedGenerationDate = avs => {
  if (!avs.meta) return '';

  const { generatedDate, timeZone } = avs.meta;
  const zonedDate = utcToZonedTime(generatedDate, timeZone);
  const shortTimeZone = getShortTimezone(avs);

  return `${format(
    zonedDate,
    "MMMM d, yyyy' at 'h:mm aaaa'",
    timeZone,
  )} ${shortTimeZone}`;
};

const fieldHasValue = value => {
  return value !== null && value !== '' && value !== undefined;
};

const allArraysEmpty = item => {
  for (const [, value] of Object.entries(item)) {
    for (const arrayItem of value) {
      if (fieldHasValue(arrayItem)) return false;
    }
  }

  return true;
};

const allFieldsEmpty = item => {
  for (const [, value] of Object.entries(item)) {
    if (fieldHasValue(value)) return false;
  }

  return true;
};

export {
  allArraysEmpty,
  allFieldsEmpty,
  fieldHasValue,
  formatImmunizationDate,
  getFormattedAppointmentDate,
  getFormattedAppointmentTime,
  getFormattedGenerationDate,
  getShortTimezone,
  parseProblemDateTime,
  parseVistaDate,
  parseVistaDateTime,
  stripDst,
};
