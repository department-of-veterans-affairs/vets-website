import { parse, parseISO, isValid } from 'date-fns';

/**
 * Properly parses a date string and returns a Date object or null
 * This addresses the issue where some utilities return strings like 'N/A' 
 * instead of proper Date objects or null on parsing failures
 * 
 * @param {string} dateString - Date string to parse
 * @param {string} format - Optional format string for parsing
 * @param {Date} referenceDate - Optional reference date for parsing
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function parseDateSafely(dateString, format = null, referenceDate = new Date()) {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    let parsedDate;
    
    if (format) {
      // Parse with specific format
      parsedDate = parse(dateString, format, referenceDate);
    } else {
      // Try to parse as ISO string first
      parsedDate = parseISO(dateString);
    }
    
    // Validate the parsed date
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  } catch (error) {
    // Log error but don't throw - return null for consistent error handling
    console.warn(`Failed to parse date: "${dateString}"`, error);
  }
  
  return null;
}

/**
 * Parses Vista-formatted date strings (MM/dd/yyyy or MM/dd/yyyy@HH:mm)
 * Returns proper Date object instead of 'N/A' string on failure
 * 
 * @param {string} vistaDate - Vista formatted date string
 * @param {boolean} includeTime - Whether the string includes time
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function parseVistaDateSafely(vistaDate, includeTime = false) {
  const format = includeTime ? 'MM/dd/yyyy@HH:mm' : 'MM/dd/yyyy';
  return parseDateSafely(vistaDate, format);
}

/**
 * Parses problem date-time strings in format "Thu Apr 07 00:00:00 PDT 2005"
 * Returns proper Date object instead of 'N/A' string on failure
 * 
 * @param {string} dateString - Problem date-time string
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function parseProblemDateTimeSafely(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    // Parse dates in the format "Thu Apr 07 00:00:00 PDT 2005"
    const dateRegex = /\w{3} (\w{3}) (\d{2}) \d{2}:\d{2}:\d{2} \w+ (\d{4})/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      return null;
    }

    const [, month, day, year] = match;
    const dateToFormat = `${month} ${day} ${year}`;
    return parseDateSafely(dateToFormat, 'MMM dd yyyy');
  } catch (error) {
    console.warn(`Failed to parse problem date-time: "${dateString}"`, error);
    return null;
  }
}

/**
 * Parses date field objects with year, month, day properties
 * Returns proper Date object, handling missing values gracefully
 * 
 * @param {Object} dateField - Object with year, month, day properties
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function parseDateFieldSafely(dateField) {
  if (!dateField || typeof dateField !== 'object') {
    return null;
  }

  const { year, month, day } = dateField;
  
  // Validate required year
  if (!year || !year.value) {
    return null;
  }

  // Handle optional month and day with defaults
  const monthValue = month?.value && month.value !== 'XX' 
    ? parseInt(month.value, 10) - 1  // Convert to 0-based month
    : 0; // Default to January
    
  const dayValue = day?.value && day.value !== 'XX'
    ? parseInt(day.value, 10)
    : 1; // Default to first day of month

  // Construct date string and parse
  const dateString = `${year.value}-${String(monthValue + 1).padStart(2, '0')}-${String(dayValue).padStart(2, '0')}`;
  return parseDateSafely(dateString, 'yyyy-MM-dd');
}

/**
 * Validates if a date string can be parsed by Date.parse()
 * This is a utility function that properly handles the Date.parse() usage
 * 
 * @param {string} dateString - The string to validate
 * @returns {boolean} - If the string is a valid date string
 */
export function isValidDateString(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  const timestamp = Date.parse(dateString);
  return !Number.isNaN(timestamp);
}

/**
 * Parses veteran date of birth with proper validation
 * Returns Date object instead of original string
 * 
 * @param {string} birthdate - Date of birth string
 * @returns {Date|null} - Parsed and validated Date object or null
 */
export function parseVeteranDobSafely(birthdate) {
  const parsedDate = parseDateSafely(birthdate);
  
  if (!parsedDate) {
    return null;
  }
  
  // Validate date is between reasonable bounds (1900 to current year)
  const currentYear = new Date().getFullYear();
  const year = parsedDate.getFullYear();
  
  if (year < 1900 || year > currentYear) {
    return null;
  }
  
  return parsedDate;
}