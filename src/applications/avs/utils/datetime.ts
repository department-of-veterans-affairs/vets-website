import { parse } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { datadogRum } from '@datadog/browser-rum';
import type { AvsData } from '../types';

export const parseProblemDateTime = (dateString: string): Date | string => {
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

  return 'N/A';
};

export const parseVistaDateTime = (date: string): Date | string => {
  try {
    const parsedDate = parse(date, 'MM/dd/yyyy@HH:mm', new Date());
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Could not parse date "${date}"`);
    }
    return parsedDate;
  } catch (error) {
    datadogRum.addError(error);
  }

  return 'N/A';
};

export const parseVistaDate = (date: string): Date | string => {
  try {
    const parsedDate = parse(date, 'MM/dd/yyyy', new Date());
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Could not parse date "${date}"`);
    }
    return parsedDate;
  } catch (error) {
    datadogRum.addError(error);
  }

  return 'N/A';
};

export const formatImmunizationDate = (date: string): string => {
  try {
    return formatDateLong(parseVistaDate(date));
  } catch (error) {
    datadogRum.addError(error);
  }
  return 'N/A';
};

const stripDst = (timeZone: string, shortTimezone: string): string => {
  let result = '';

  if (timeZone && shortTimezone) {
    result =
      /^(America|US\/)/.test(timeZone) && /^[PMCE][DS]T$/.test(shortTimezone)
        ? shortTimezone.replace('ST', 'T').replace('DT', 'T')
        : shortTimezone;
  }

  return result;
};

export const getShortTimezone = (avs: AvsData): string => {
  try {
    const { timeZone } = avs.meta;

    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      timeZoneName: 'short',
    };
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

export const getFormattedAppointmentTime = (
  twentyFourHourTime: string,
): string => {
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

export const getFormattedAppointmentDate = (avs: AvsData): string => {
  try {
    const dateTime = `${avs.clinicsVisited[0].date}@${avs.clinicsVisited[0].time}`;
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

export const getFormattedGenerationDate = (avs: AvsData): string => {
  try {
    const { generatedDate, timeZone } = avs.meta;
    const zonedDate = utcToZonedTime(generatedDate, timeZone);

    if (Number.isNaN(zonedDate.getTime())) {
      throw new Error(
        `Could not parse date "${generatedDate}" in timezone "${timeZone}"`,
      );
    }
    const shortTimeZone = getShortTimezone(avs);
    return `${format(zonedDate, "MMMM d, yyyy' at 'h:mm aaaa'", {
      timeZone,
    })} ${shortTimeZone}`;
  } catch (error) {
    datadogRum.addError(error);
  }

  return 'N/A';
};

export { stripDst };
