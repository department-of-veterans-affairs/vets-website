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
 * @param {*} format defaults to 'MMMM d, yyyy, h:mm a', date-fns formatting guide found here: https://date-fns.org/v2.27.0/docs/format
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
 * Format a FHIR dateTime string as a "local datetime" string, by stripping off the time zone
 * information and formatting what's left. FHIR allows only:
 *   - YYYY
 *   - YYYY-MM
 *   - YYYY-MM-DD
 *   - YYYY-MM-DDThh:mm:ss(.sss)(Z|±HH:MM)
 *
 * See: https://hl7.org/fhir/R4/datatypes.html#dateTime
 *
 * @param {String} datetime FHIR dateTime string, e.g. 2017-08-02T09:50:57-04:00, 2000-08-09
 * @param {*} format defaults to 'MMMM d, yyyy, h:mm a', ONLY applied to full dateTime strings
 * @returns {String} a formatted datetime, e.g. August 2, 2017, 9:50 a.m., or null for bad inputs
 */
export function dateFormatWithoutTimezone(
  isoString,
  fmt = 'MMMM d, yyyy, h:mm a',
) {
  if (!isoString || typeof isoString !== 'string') return null;

  // 1) Year-only: YYYY
  if (/^\d{4}$/.test(isoString)) {
    return isoString;
  }

  // 2) Year+month: YYYY-MM
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(isoString)) {
    const d = parseISO(`${isoString}-01`);
    if (!isValid(d)) return null;
    return dateFnsFormat(d, 'MMMM yyyy');
  }

  // 3) Full date: YYYY-MM-DD
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(isoString)) {
    const d = parseISO(isoString);
    if (!isValid(d)) return null;
    return dateFnsFormat(d, 'MMMM d, yyyy');
  }

  // 4) Date-time (must include seconds + TZ): strip off exactly “Z” or “+HH:MM”
  const stripped = isoString.replace(/(Z|[+-]\d{2}:\d{2})$/, '');

  // 5) Handle leap-second (“:60” -> “:59”)
  const fixedLeap = stripped.replace(/:60(\.\d+)?$/, ':59$1');

  const dt = parseISO(fixedLeap);
  if (!isValid(dt)) return null;

  return dateFnsFormat(dt, fmt)
    .replace(/\bAM\b/g, 'a.m.')
    .replace(/\bPM\b/g, 'p.m.');
}

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
 * Formats a date string to a human-readable representation, handling cases where only the year or
 * year-month portion is provided.
 *
 * @param {String} str The input date string to format
 * @returns {string} A human-readable date string (see examples)
 * @example formatDate("2025"); // "2025"
 * @example formatDate("2025-07"); // "July, 2025"
 * @example formatDate("2025-07-15"); // "July 15, 2025" (any other ISO 8601 date returns this format)
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
 * @param {Date} retrievedDate - The Date the refresh status was retrieved (MUST be a Date object).
 * @param {Array<Object>} phrStatus - The list of PHR status extracts.
 * @param {string} extractType - The extract for which to return the phase (e.g. 'VPR').
 * @returns {string|null} The current refresh phase, or null if parameters are invalid.
 */
export const getStatusExtractPhase = (
  retrievedDate,
  phrStatus,
  extractType,
) => {
  // 1) Basic sanity‐checks on the inputs
  if (
    !(retrievedDate instanceof Date) ||
    Number.isNaN(retrievedDate.getTime()) ||
    !Array.isArray(phrStatus) ||
    !extractType
  ) {
    return null;
  }

  // 2) Find the extract status object
  const extractStatus = phrStatus.find(
    status => status.extract === extractType,
  );
  if (!extractStatus) return null;

  const {
    upToDate,
    loadStatus,
    errorMessage,
    lastRequested,
    lastCompleted,
    lastSuccessfulCompleted,
  } = extractStatus;

  // 3) Compute whether we have an “error” condition
  const hasExplicitLoadError =
    upToDate && loadStatus === 'ERROR' && !!errorMessage;

  // 4) If we don’t have all three timestamps AND there is no error-case to justify missing dates, bail out
  if (
    (!lastRequested || !lastCompleted || !lastSuccessfulCompleted) &&
    !hasExplicitLoadError
  ) {
    return null;
  }

  // 5) Coerce each of those three fields into a Date (if already a Date, fine; otherwise new Date())
  const requested =
    lastRequested instanceof Date ? lastRequested : new Date(lastRequested);
  const completed =
    lastCompleted instanceof Date ? lastCompleted : new Date(lastCompleted);
  const successfulCompleted =
    lastSuccessfulCompleted instanceof Date
      ? lastSuccessfulCompleted
      : new Date(lastSuccessfulCompleted);

  // 6) If any of those new Date() calls turned into an invalid date, bail out
  if (
    Number.isNaN(requested.getTime()) ||
    Number.isNaN(completed.getTime()) ||
    Number.isNaN(successfulCompleted.getTime())
  ) {
    return null;
  }

  // 7) Compute how long it’s been since the last completion
  const timeSinceLastCompleted = retrievedDate.getTime() - completed.getTime();

  // 8) Now do the “phase” logic in a fixed order:
  //    **The order below is critical**:
  //      1) STALE must be checked first
  //      2) IN_PROGRESS must come before FAILED
  //      3) FAILED must come before CURRENT
  //    Reordering these checks will change the result in certain edge cases.

  //  8a) STALE (highest priority)
  if (timeSinceLastCompleted > VALID_REFRESH_DURATION) {
    return refreshPhases.STALE;
  }

  //  8b) IN_PROGRESS (only if the last “completed” timestamp is before the last “requested”)
  if (completed.getTime() < requested.getTime() && !hasExplicitLoadError) {
    return refreshPhases.IN_PROGRESS;
  }

  //  8c) FAILED (either a loadStatus=ERROR case or completed ≠ successfulCompleted)
  if (
    hasExplicitLoadError ||
    completed.getTime() !== successfulCompleted.getTime()
  ) {
    return refreshPhases.FAILED;
  }

  //  8d) If none of the above, it must be CURRENT
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
  newRecordsFound,
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
    ...(newRecordsFound
      ? [refreshPhases.CURRENT, refreshPhases.FAILED]
      : [refreshPhases.FAILED, refreshPhases.CURRENT]),
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
  if (
    matchingDates?.length &&
    matchingDates.length === extractTypeList.length
  ) {
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
 * Format an ISO 8601 date in the local browser timezone.
 *
 * @param {string|number} date the date to format, in ISO 8601 format or as a millisecond timestamp
 * @param {boolean} hideTimeZone hide time zone in output if true, otherwise include it (default is false)
 * @returns {String} a formatted date and time string in the local timezone
 * @example formatDateInLocalTimezone(1712264626910, true); // "April 4, 2024 5:03 p.m."
 * @example formatDateInLocalTimezone('1997-05-07T19:14:00Z', true); // "May 7, 1997 3:14 p.m."
 * @example formatDateInLocalTimezone('1997-05-07T19:14:00Z'); // "May 7, 1997 3:14 p.m. EDT"
 */
export const formatDateInLocalTimezone = (date, hideTimeZone = false) => {
  let dateObj;

  if (typeof date === 'number') {
    dateObj = new Date(date); // Millisecond timestamp
  } else {
    dateObj = parseISO(date); // ISO 8601
  }

  const formattedDate = dateFnsFormat(dateObj, 'MMMM d, yyyy h:mm aaaa');
  if (hideTimeZone) {
    return formattedDate;
  }

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
