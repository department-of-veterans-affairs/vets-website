import moment from 'moment-timezone';
import { datadogRum } from '@datadog/browser-rum';
import { snakeCase } from 'lodash';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  format as dateFnsFormat,
  formatISO,
  subYears,
  addMonths,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
} from 'date-fns';
import {
  EMPTY_FIELD,
  interpretationMap,
  refreshPhases,
  VALID_REFRESH_DURATION,
  Paths,
  Breadcrumbs,
} from './constants';

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} formatted timestamp
 */
export const dateFormat = (timestamp, format = null) => {
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM D, YYYY, h:mm a z');
};

export const dateFormatWithoutTime = str => {
  return str.replace(/,? \d{1,2}:\d{2} (a\.m\.|p\.m\.)$/, '');
};

/**
 * @param {*} datetime (2017-08-02T09:50:57-04:00 or 2000-08-09)
 * @param {*} format defaults to 'MMMM d, yyyy, h:mm a', momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} formatted datetime (August 2, 2017, 9:50 a.m.)
 */
export const dateFormatWithoutTimezone = (
  datetime,
  format = 'MMMM d, yyyy, h:mm a',
) => {
  let withoutTimezone = datetime;
  if (typeof datetime === 'string' && datetime.includes('-')) {
    // Check if datetime has a timezone and strip it off if present
    if (datetime.includes('T')) {
      withoutTimezone = datetime
        .substring(datetime.indexOf('T'), datetime.length)
        .includes('-')
        ? datetime.substring(0, datetime.lastIndexOf('-'))
        : datetime.replace('Z', '');
    } else {
      // Handle the case where the datetime is just a date (e.g., "2000-08-09")
      const parsedDate = parseISO(datetime);
      if (isValid(parsedDate)) {
        return dateFnsFormat(parsedDate, 'MMMM d, yyyy', { in: 'UTC' });
      }
    }
  } else {
    withoutTimezone = new Date(datetime).toISOString().replace('Z', '');
  }

  const parsedDateTime = parseISO(withoutTimezone);
  if (isValid(parsedDateTime)) {
    const formattedDate = dateFnsFormat(parsedDateTime, format, { in: 'UTC' });
    return formattedDate.replace(/AM|PM/, match =>
      match.toLowerCase().replace('m', '.m.'),
    );
  }

  return null;
};

/**
 * @param {Object} nameObject {first, middle, last, suffix}
 * @returns {String} formatted timestamp
 */
export const nameFormat = ({ first, middle, last, suffix }) => {
  let name = `${last}, ${first}`;
  if (middle) name += ` ${middle}`;
  if (suffix) name += `, ${suffix}`;
  return name;
};

/**
 * @param {Object} record
 * @returns {Array of Strings} array of reactions
 */
export const getReactions = record => {
  const reactions = [];
  if (!record || !record.reaction) return reactions;
  record.reaction.forEach(reaction => {
    reaction.manifestation.forEach(manifestation => {
      reactions.push(manifestation.text);
    });
  });
  return reactions;
};

/**
 * @param {Any} obj
 * @returns {Boolean} true if obj is an array and has at least one item
 */
export const isArrayAndHasItems = obj => {
  return Array.isArray(obj) && obj.length;
};

/**
 * For every record.interpretation[].text value in a record, find the right display value
 * then concatenate them all together. If no mapping value is found for the code, the code
 * itself is displayed.
 *
 * @param {Object} record
 * @returns {String} list of interpretations, separated by a comma
 */
export const concatObservationInterpretations = record => {
  if (isArrayAndHasItems(record.interpretation)) {
    const textFields = record.interpretation
      .filter(interpretation => interpretation.text)
      .map(
        interpretation =>
          interpretationMap[interpretation.text] || interpretation.text,
      );
    return textFields.join(', ');
  }
  return null;
};

/**
 * @param {*} observation - a FHIR Observation object
 * @returns {String} the value with units, e.g. "5 ml"
 */
export const getObservationValueWithUnits = observation => {
  if (observation.valueQuantity) {
    return {
      observationValue: observation.valueQuantity.value,
      observationUnit: observation.valueQuantity.unit,
    };
  }
  return null;
};

/**
 * @param {Array} list
 * @returns {String} array of strings, separated by a comma
 */
export const processList = list => {
  if (Array.isArray(list)) {
    if (list?.length > 1) return list.join('. ');
    if (list?.length === 1) return list.toString();
  }
  return EMPTY_FIELD;
};

/**
 * Macro case is naming with all letters Capitalized but the words are joined with _ ( underscore)
 * @param {String} str string
 * @returns {String} MACRO_CASE
 */
export const macroCase = str => {
  return snakeCase(str).toUpperCase();
};

/**
 * Extract a contained resource from a FHIR resource's "contained" array.
 * @param {Object} resource a FHIR resource (e.g. AllergyIntolerance)
 * @param {String} referenceId an internal ID referencing a contained resource
 * @returns the specified contained FHIR resource, or null if not found
 */
export const extractContainedResource = (resource, referenceId) => {
  if (resource && isArrayAndHasItems(resource.contained) && referenceId) {
    // Strip the leading "#" from the reference.
    const strippedRefId = referenceId.substring(1);
    const containedResource = resource.contained.find(
      containedItem => containedItem.id === strippedRefId,
    );
    return containedResource || null;
  }
  return null;
};

/**
 * Extract a specimen resource from a FHIR resource's "contained" array.
 * @param {Object} record a FHIR resource (e.g. AllergyIntolerance)
 * @param {String} resourceType takes a resourceType to return a record from "contained"
 * @param {Array} referenceArray takes an array to use as a reference
 * @returns the specified contained FHIR resource, or null if not found
 */
export const extractContainedByRecourceType = (
  record,
  resourceType,
  referenceArray,
) => {
  if (record && resourceType && isArrayAndHasItems(referenceArray)) {
    const refArray = [];
    referenceArray.map(entry =>
      refArray.push(entry.reference.replace('#', '')),
    );
    const returnRecord = isArrayAndHasItems(record.contained)
      ? record.contained.find(
          item =>
            refArray.includes(item.id) && item.resourceType === resourceType,
        )
      : null;
    return returnRecord || null;
  }
  return null;
};

/**
 * Download a text file
 * @param {String} content text file content
 * @param {String} fileName name for the text file
 */
export const generateTextFile = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

/**
 * Helper function to retrieve details for a given item.
 *
 * If a matching item is found in the list, those details are returned.
 * If no matching item is found, it fetches the details for the given id using getDetail().
 *
 * @param {string} id - The ID of the detail to retrieve.
 * @param {Array} list - The list of detail object to search in.
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Function} getDetail - The function to fetch detail's object by ID from an API.
 * @param {string} actionsGetFromList - The action type to dispatch when a matching item is found in the list.
 * @param {string} actionsGet - The action type to dispatch when a matching item is not found in the list.
 */
export const dispatchDetails = async (
  id,
  list,
  dispatch,
  getDetail,
  actionsGetFromList,
  actionsGet,
) => {
  const matchingItem = list && list.find(item => item.id === id);

  if (matchingItem) {
    dispatch({ type: actionsGetFromList, response: matchingItem });
  } else {
    const response = await getDetail(id);
    dispatch({ type: actionsGet, response });
  }
};

/**
 * Parse a value from a url using the parameter name
 * @param {String} url url
 * @param {String} paramName name for the text file
 */
export const getParamValue = (url, paramName) => {
  const getParams = new URLSearchParams(url);
  return getParams.get(`${paramName}`) ? getParams.get(`${paramName}`) : 1;
};

/**
 * Function: getActiveLinksStyle
 * Description: Determines the style for active links based on the linkPath and currentPath.
 * Pre-conditions:
 * - linkPath: A string representing the path of the link being evaluated.
 * - currentPath: A string representing the current path of the application.
 * Post-conditions:
 * - Returns 'is-active' if the link is active, otherwise returns an empty string.
 * @param {string} linkPath - The path of the link being evaluated.
 * @param {string} currentPath - The current path of the application.
 * @returns {string} - 'is-active' if the link is active, otherwise an empty string.
 */
export const getActiveLinksStyle = (linkPath, currentPath) => {
  let relativePath;

  if (linkPath === '/' && currentPath === '/') {
    return 'is-active';
  }

  const pathArr = currentPath.slice(1).split('/');

  if (
    pathArr.length > 1 &&
    pathArr.length < 5 &&
    pathArr[0] === 'labs-and-tests'
  ) {
    relativePath = '/labs-and-tests';
  } else if (pathArr.length === 3) {
    relativePath = `/${pathArr[0]}/${pathArr[1]}`;
  } else {
    relativePath = currentPath;
  }

  if (linkPath.split('/')[1] === relativePath.split('/')[1]) {
    return 'is-active';
  }

  return '';
};

/**
 * Formats the date and accounts for the lack of a 'dd' in a date
 * @param {String} str str
 */
export const formatDate = str => {
  const yearRegex = /^\d{4}$/;
  const monthRegex = /^\d{4}-\d{2}$/;
  if (yearRegex.test(str)) {
    return str;
  }
  if (monthRegex.test(str)) {
    return dateFnsFormat(parseISO(str), 'MMMM, yyyy', { in: 'UTC' });
  }
  return formatDateLong(str);
};

/**
 * Returns a date formatted into three parts -- a date portion, a time portion, and a time zone.
 *
 * @param {Date | string} date
 */
export const formatDateAndTime = rawDate => {
  let date = rawDate;
  if (typeof rawDate === 'string') {
    date = new Date(rawDate);
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'p.m.' : 'a.m.';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timePart = `${formattedHours}:${formattedMinutes} ${period}`;

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const datePart = date.toLocaleDateString('en-US', options);
  const timeZonePart = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
  })
    .formatToParts(date)
    .find(part => part.type === 'timeZoneName')?.value;

  return {
    date: datePart,
    time: timePart,
    timeZone: timeZonePart,
  };
};

/**
 * Determine whether the PHR refresh for a particular extract is stale, in progress, current, or failed.
 *
 * @param {*} retrievedDate the timestamp (in ms) that the refresh status was retrieved
 * @param {*} phrStatus the list of PHR status extracts
 * @param {*} extractType the extract for which to return the phase (e.g. 'VPR')
 * @returns {string|null} the current refresh phase, or null if parameters are invalid.
 */
export const getStatusExtractPhase = (
  retrievedDate,
  phrStatus,
  extractType,
) => {
  if (!retrievedDate || !phrStatus || !extractType) return null;
  const extractStatus = phrStatus.find(
    status => status.extract === extractType,
  );
  if (
    !extractStatus?.lastRequested ||
    !extractStatus?.lastCompleted ||
    !extractStatus?.lastSuccessfulCompleted
  ) {
    return null;
  }
  if (retrievedDate - extractStatus.lastCompleted > VALID_REFRESH_DURATION) {
    return refreshPhases.STALE;
  }
  if (extractStatus.lastCompleted < extractStatus.lastRequested) {
    return refreshPhases.IN_PROGRESS;
  }
  if (
    extractStatus.lastCompleted.getTime() !==
    extractStatus.lastSuccessfulCompleted.getTime()
  ) {
    return refreshPhases.FAILED;
  }
  return refreshPhases.CURRENT;
};

/**
 * Determine the overall phase for a PHR refresh, based on the phases of each component extract.
 * The highest-priority extract phase takes precedence. For example, if one extract phase is
 * IN_PROGRESS, then the overall status is IN_PROGRESS.
 *
 * @param {Object} refreshStatus the list of individual extract statuses
 * @returns the current overall refresh phase, or null if needed data is missing
 */
export const getStatusExtractListPhase = (
  retrievedDate,
  phrStatus,
  extractTypeList,
) => {
  if (!Array.isArray(extractTypeList) || extractTypeList.length === 0) {
    return null;
  }

  const phaseList = extractTypeList.map(extractType =>
    getStatusExtractPhase(retrievedDate, phrStatus, extractType),
  );

  const phasePriority = [
    refreshPhases.IN_PROGRESS,
    refreshPhases.STALE,
    refreshPhases.CURRENT,
    refreshPhases.FAILED,
  ];

  for (const phase of phasePriority) {
    if (phaseList.includes(phase)) {
      return phase;
    }
  }
  return null;
};

export const decodeBase64Report = data => {
  if (data && typeof data === 'string') {
    return Buffer.from(data, 'base64')
      .toString('utf-8')
      .replace(/\r\n|\r/g, '\n'); // Standardize line endings
  }
  return null;
};

/**
 * @param {Array} refreshStateStatus The array of refresh state objects containing extract types and their statuses
 * @param {*} extractTypeList The type(s) of extract we want to find in the refresh state (e.g., CHEM_HEM)
 * @returns {Object} an object containing the last time that all extracts were up to date
 */
export const getLastSuccessfulUpdate = (
  refreshStateStatus,
  extractTypeList,
) => {
  const matchingDates = refreshStateStatus
    ?.filter(status => extractTypeList.includes(status.extract))
    ?.map(status => {
      const date = status.lastSuccessfulCompleted;
      return typeof date === 'string' ? new Date(date) : date;
    })
    ?.filter(Boolean);

  if (matchingDates?.length) {
    const minDate = new Date(
      Math.min(...matchingDates.map(date => date.getTime())),
    );
    return formatDateAndTime(minDate);
  }
  return null;
};

/**
 * @function getLastUpdatedText
 * @description Generates a string that displays the last successful update for a given extract type.
 * It checks the refresh state status and formats the time and date of the last update.
 *
 * @param {Array} refreshStateStatus - The array of refresh state objects containing extract types and their statuses.
 * @param {string|Array} extractType - The type(s) of extract we want to find in the refresh state (e.g., CHEM_HEM).
 *
 * @returns {string|null} - Returns a formatted string with the time and date of the last update, or null if no update is found.
 */
export const getLastUpdatedText = (refreshStateStatus, extractType) => {
  if (refreshStateStatus) {
    const lastSuccessfulUpdate = getLastSuccessfulUpdate(
      refreshStateStatus,
      Array.isArray(extractType) ? extractType : [extractType],
    );

    if (lastSuccessfulUpdate) {
      return `Last updated at ${lastSuccessfulUpdate.time} on ${
        lastSuccessfulUpdate.date
      }`;
    }
  }
  return null;
};

/**
 * @param {Object} name data from FHIR object containing name
 * @returns {String} formatted timestamp
 */
export const formatNameFirstToLast = name => {
  try {
    if (typeof name === 'object') {
      if ('family' in name && 'given' in name) {
        const firstname = name.given?.join(' ');
        const lastname = name.family;
        return `${firstname} ${lastname}`;
      }

      const parts = name?.text.split(',');
      if (parts?.length !== 2) {
        return name.text;
      }
      const [lastname, firstname] = parts;
      return `${firstname} ${lastname}`;
    }
    const parts = name.split(',');
    if (parts.length !== 2) {
      return name;
    }
    const [lastname, firstname] = parts;
    return `${firstname} ${lastname}`;
  } catch {
    return null;
  }
};

// Imaging methods ------------

/**
 * @param {Array} list array of objects being parsed for the imaging endpoint.
 */
export const extractImageAndSeriesIds = list => {
  const newList = [];
  let num = 1;
  list.forEach(item => {
    const numbers = item.match(/\d+/g);
    const result = numbers.join('/');
    newList.push({ index: num, seriesAndImage: result });
    num += 1;
  });
  return newList;
};

/**
 * @param {Object} dateParams an object for the date
 * @param {string} dateParams.date the date to format, in YYYY-MM format
 * @param {string} dateParams.mask the format to return the date in, using date-fns masks, default is 'MMMM yyyy'
 * @returns {String} formatted timestamp
 */
export const getMonthFromSelectedDate = ({ date, mask = 'MMMM yyyy' }) => {
  if (!date) return null;
  const format = /[0-9]{4}-[0-9]{2}/g;
  if (!date.match(format)) return null;
  const [year, month] = date.split('-');
  const fromDate = new Date(year, month - 1, 1);
  const formatted = dateFnsFormat(fromDate, mask);
  return `${formatted}`;
};

export const sendDataDogAction = actionName => {
  datadogRum.addAction(actionName);
};

export const handleDataDogAction = ({
  locationBasePath,
  locationChildPath,
  sendAnalytics = true,
}) => {
  const domainPaths = [
    Paths.LABS_AND_TESTS,
    Paths.CARE_SUMMARIES_AND_NOTES,
    Paths.VACCINES,
    Paths.ALLERGIES,
    Paths.HEALTH_CONDITIONS,
    Paths.VITALS,
  ];

  const isVitalsDetail =
    Paths.VITALS.includes(locationBasePath) && locationChildPath;

  const isDomain = domainPaths.some(path => path.includes(locationBasePath));
  const isDetailPage = isDomain && !!locationChildPath;
  const path = locationBasePath
    ? `/${locationBasePath}/${isVitalsDetail ? locationChildPath : ''}`
    : '/';
  const feature = Object.keys(Paths).find(_path => Paths[_path].includes(path));

  let tag = '';
  if (isVitalsDetail) {
    tag = `Back - Vitals - ${Breadcrumbs[feature].label}`;
  } else if (isDomain) {
    tag = `Back - ${Breadcrumbs[feature].label} - ${
      isDetailPage ? 'Detail' : 'List'
    }`;
  } else {
    tag = `Breadcrumb - ${Breadcrumbs[feature].label}`;
  }
  if (sendAnalytics) {
    sendDataDogAction(tag);
  }
  return tag;
};

/**
 * Format a iso8601 date in the local browser timezone.
 *
 * @param {string} date the date to format, in ISO8601 format
 * @returns {String} formatted timestamp
 */
export const formatDateInLocalTimezone = date => {
  const dateObj = parseISO(date);
  const formattedDate = dateFnsFormat(dateObj, 'MMMM d, yyyy h:mm aaaa');
  const localTimeZoneName = dateObj
    .toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'short' })
    .substring(4);
  return `${formattedDate} ${localTimeZoneName}`;
};

/**
 * Form Helper to focus on error field
 */
export const focusOnErrorField = () => {
  setTimeout(() => {
    const errors = document.querySelectorAll('[error]:not([error=""])');
    const firstError =
      errors.length > 0 &&
      (errors[0]?.shadowRoot?.querySelector('select, input, textarea') ||
        errors[0]
          ?.querySelector('va-checkbox')
          ?.shadowRoot?.querySelector('input') ||
        errors[0].querySelector('input'));

    if (firstError) {
      focusElement(firstError);
    }
  }, 300);
};

/**
 * Removes the trailing slash from a path
 *
 * @param {string} path path to remove trailing slash from
 * @returns {string} path without trailing slash
 */
export const removeTrailingSlash = path => {
  if (!path) return path;
  return path.replace(/\/$/, '');
};

export const getAppointmentsDateRange = (fromDate, toDate) => {
  function clamp(d, min, max) {
    if (d < min) return min;
    if (d > max) return max;
    return d;
  }

  const now = new Date();
  const earliest = startOfDay(subYears(now, 2));
  const latest = endOfDay(addMonths(now, 13));

  // parse or default
  const rawFrom = fromDate ? startOfDay(parseISO(fromDate)) : earliest;
  const rawTo = toDate ? endOfDay(parseISO(toDate)) : latest;

  // clamp both ends
  let clampedFrom = clamp(rawFrom, earliest, latest);
  let clampedTo = clamp(rawTo, earliest, latest);

  // ensure from <= to
  if (clampedFrom > clampedTo) {
    clampedFrom = earliest;
    clampedTo = latest;
  }

  return {
    startDate: formatISO(clampedFrom),
    endDate: formatISO(clampedTo),
  };
};
