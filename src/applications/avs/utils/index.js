import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';

const parseProblemDateTime = dateString => {
  try {
    // Parse dates in the format "Thu Apr 07 00:00:00 PDT 2005"
    // Extract the month, day, and year
    const parts = dateString.split(' ');
    if (parts.length >= 6) {
      const month = parts[1];
      const day = parseInt(parts[2], 10);
      const year = parseInt(parts[5], 10);

      const date = new Date(`${month} ${day}, ${year}`);
      if (date.toString() !== 'Invalid Date') {
        return date;
      }
    }
  } catch (error) {
    // Fall back to default value.
  }

  return 'N/A';
};

const parseVistaDateTime = date => {
  try {
    const parsedDate = parse(date, 'MM/dd/yyyy@HH:mm', new Date());
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  } catch (error) {
    // Fall back to default value.
  }

  return 'N/A';
};

const parseVistaDate = date => {
  try {
    const parsedDate = parse(date, 'MM/dd/yyyy', new Date());
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  } catch (error) {
    // Fall back to default value.
  }

  return 'N/A';
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
  let result = '';

  if (timeZone && shortTimezone) {
    result =
      /^(America|US\/)/.test(timeZone) && /^[PMCE][DS]T$/.test(shortTimezone)
        ? shortTimezone.replace('ST', 'T').replace('DT', 'T')
        : shortTimezone;
  }

  return result;
};

const getShortTimezone = avs => {
  try {
    const { timeZone } = avs.meta;

    const options = { timeZone, timeZoneName: 'short' };
    const shortTimezone = new Intl.DateTimeFormat('en-US', options)
      .format(utcToZonedTime(new Date(), timeZone))
      .split(' ')[1];

    // Strip out middle char in short timezone.
    return stripDst(timeZone, shortTimezone);
  } catch (error) {
    // Fall back to default value.
  }

  return '';
};

const getFormattedAppointmentTime = twentyFourHourTime => {
  try {
    const time = parse(twentyFourHourTime, 'HH:mm', new Date());
    if (!Number.isNaN(time.getTime())) {
      return format(time, 'h:mm aaaa');
    }
  } catch (error) {
    // Fall back to default value.
  }

  return '';
};

const getFormattedAppointmentDate = avs => {
  try {
    const formattedDate = formatDateLong(
      parseVistaDateTime(
        `${avs.clinicsVisited[0].date}@${avs.clinicsVisited[0].time}`,
      ),
    );

    if (formattedDate !== 'Invalid Date') {
      return formattedDate;
    }
  } catch (error) {
    // Fall back to default value.
  }

  return '';
};

const getFormattedGenerationDate = avs => {
  try {
    const { generatedDate, timeZone } = avs.meta;
    const zonedDate = utcToZonedTime(generatedDate, timeZone);

    if (!Number.isNaN(zonedDate.getTime())) {
      const shortTimeZone = getShortTimezone(avs);
      return `${format(
        zonedDate,
        "MMMM d, yyyy' at 'h:mm aaaa'",
        timeZone,
      )} ${shortTimeZone}`;
    }
  } catch (error) {
    // Fall back to default value.
  }

  return 'N/A';
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
