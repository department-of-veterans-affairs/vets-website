import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { datadogRum } from '@datadog/browser-rum';

const parseProblemDateTime = dateString => {
  try {
    // Parse dates in the format "Thu Apr 07 00:00:00 PDT 2005"
    const dateRegex = /\w{3} (\w{3}) (\d{2}) \d{2}:\d{2}:\d{2} \w+ (\d{4})/;
    const match = dateString.match(dateRegex);
    if (!match) throw new Error(`Could not parse date "${dateString}"`);

    const [, month, day, year] = match;
    const dateToFormat = `${month} ${day} ${year}`;
    const parsedDate = parse(dateToFormat, 'MMM dd yyyy', new Date());

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Could not parse date "${dateString}"`);
    }
    return parsedDate;
  } catch (error) {
    datadogRum.addError(error);
  }

  // Return null instead of 'N/A' string for consistent Date object handling
  return null;
};

const parseVistaDateTime = date => {
  try {
    const parsedDate = parse(date, 'MM/dd/yyyy@HH:mm', new Date());
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Could not parse date "${date}"`);
    }
    return parsedDate;
  } catch (error) {
    datadogRum.addError(error);
  }

  // Return null instead of 'N/A' string for consistent Date object handling
  return null;
};

const parseVistaDate = date => {
  try {
    const parsedDate = parse(date, 'MM/dd/yyyy', new Date());
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Could not parse date "${date}"`);
    }
    return parsedDate;
  } catch (error) {
    datadogRum.addError(error);
  }

  // Return null instead of 'N/A' string for consistent Date object handling
  return null;
};

const formatImmunizationDate = date => {
  try {
    const parsedDate = parseVistaDate(date);
    if (parsedDate === null) {
      return 'N/A';
    }
    return formatDateLong(parsedDate);
  } catch (error) {
    datadogRum.addError(error);
  }
  return 'N/A';
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
    datadogRum.addError(error);
  }

  return '';
};

const getFormattedAppointmentTime = twentyFourHourTime => {
  try {
    const time = parse(twentyFourHourTime, 'HH:mm', new Date());
    if (Number.isNaN(time.getTime())) {
      throw new Error(`Could not parse time "${twentyFourHourTime}"`);
    }
    return format(time, 'h:mm aaaa');
  } catch (error) {
    datadogRum.addError(error);
  }

  return '';
};

const getFormattedAppointmentDate = avs => {
  try {
    const dateTime = `${avs.clinicsVisited[0].date}@${
      avs.clinicsVisited[0].time
    }`;
    const formattedDate = formatDateLong(parseVistaDateTime(dateTime));

    if (formattedDate === 'Invalid Date') {
      throw new Error(`Could not parse date "${dateTime}"`);
    }
    return formattedDate;
  } catch (error) {
    datadogRum.addError(error);
  }

  return '';
};

const getFormattedGenerationDate = avs => {
  try {
    const { generatedDate, timeZone } = avs.meta;
    const zonedDate = utcToZonedTime(generatedDate, timeZone);

    if (Number.isNaN(zonedDate.getTime())) {
      throw new Error(
        `Could not parse date "${generatedDate}" in timezone "${timeZone}"`,
      );
    }
    const shortTimeZone = getShortTimezone(avs);
    return `${format(
      zonedDate,
      "MMMM d, yyyy' at 'h:mm aaaa'",
      timeZone,
    )} ${shortTimeZone}`;
  } catch (error) {
    datadogRum.addError(error);
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
