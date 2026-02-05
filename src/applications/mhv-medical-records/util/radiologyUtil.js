/**
 * This function was based on RadiologyTransformer.parseRadiologyReport from MHV Classic. It pulls
 * fields out of a text report and puts them into an object.
 *
 * @TODO: This logic should be moved to the API so that the mobile client can use it.
 *
 * @param {String} radiologyReportText the raw text of a radiology report
 * @returns an object containing information from the report
 */
export const parseRadiologyReport = radiologyReportText => {
  const radiologyReportMap = {};
  const lines = radiologyReportText ? radiologyReportText.split(/\r?\n/) : [];
  let i = 0;
  let clinicalHistory = '';
  let reportText = '';
  let impressionText = '';
  let inImpression = false;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith('Exm Date:')) {
      // Extract "Exm Date"
      radiologyReportMap['Exm Date'] = line
        .substring('Exm Date:'.length)
        .trim();
    } else if (line.startsWith('Date Verified:')) {
      // Extract "Date Verified" and validate date pattern
      let dateValue = line.substring('Date Verified:'.length).trim();
      const datePattern = /[A-Z]{3} \d{1,2}, \d{4}/i;
      if (!datePattern.test(dateValue)) {
        dateValue = '[Unknown]';
      }
      radiologyReportMap['Date Verified'] = dateValue;
    } else if (line.startsWith('Reason for Study:')) {
      // Extract "Reason for Study"
      radiologyReportMap['Reason for Study'] = line
        .substring('Reason for Study:'.length)
        .trim();
    } else if (line.startsWith('Req Phys:')) {
      // Extract "Req Phys" and remove "Pat Loc" and subsequent text
      let value = line.substring('Req Phys:'.length).trim();
      const patLocIndex = value.indexOf('Pat Loc');
      if (patLocIndex !== -1) {
        value = value.substring(0, patLocIndex).trim();
      }
      radiologyReportMap['Req Phys'] = value;
    } else if (line.startsWith('Clinical History:')) {
      // Begin collecting "Clinical History"
      clinicalHistory = '';
      i += 1;
      while (i < lines.length) {
        const historyLine = lines[i].trim();
        if (historyLine.startsWith('Report Status:')) {
          // Extract "Report Status" and remove "Date Reported" if present
          let statusValue = historyLine
            .substring('Report Status:'.length)
            .trim();
          const dateReportedIndex = statusValue.indexOf('Date Reported');
          if (dateReportedIndex !== -1) {
            statusValue = statusValue.substring(0, dateReportedIndex).trim();
          }
          radiologyReportMap['Report Status'] = statusValue;
          break; // Exit the Clinical History collection
        } else if (historyLine !== '') {
          clinicalHistory += `${historyLine}\n`;
        }
        i += 1;
      }
      radiologyReportMap['Clinical History'] = clinicalHistory.trim();
    } else if (line.startsWith('Report:')) {
      // Begin collecting "Report" and "Impression"
      reportText = '';
      impressionText = '';
      inImpression = false;
      i += 1;
      while (i < lines.length) {
        const reportLine = lines[i].trim();
        if (reportLine.startsWith('Impression:')) {
          // Switch to collecting "Impression"
          inImpression = true;
        } else if (reportLine.startsWith('Primary Interpreting Staff:')) {
          // End of "Impression" section
          break; // Exit the Report collection
        } else if (inImpression) {
          if (reportLine !== '') {
            impressionText += `${reportLine}\n`;
          }
        } else if (reportLine !== '') {
          reportText += `${reportLine}\n`;
        }
        i += 1;
      }
      radiologyReportMap.Report = reportText.trim();
      radiologyReportMap.Impression = impressionText.trim();
    }
    i += 1;
  }

  return radiologyReportMap;
};

/**
 * Compare two dates and return true if they are both valid and are equal to the minute.
 * The dates can have the formats: "1712264604902", "2004-01-06T19:27:00Z"
 *
 * @param {String} var1 first date string
 * @param {String} var2 second date string
 * @returns true if the dates are equal to the minute, otherwise false
 */
export const areDatesEqualToMinute = (var1, var2) => {
  const parseDate = input => {
    let date;
    if (/^\d+$/.test(input)) {
      // Input is a numeric string, parse it as a number (timestamp)
      date = new Date(Number(input));
    } else {
      // Input is likely an ISO date string
      date = new Date(input);
    }
    return date;
  };

  const date1 = parseDate(var1);
  const date2 = parseDate(var2);

  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) {
    return false;
  }

  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCHours() === date2.getUTCHours() &&
    date1.getUTCMinutes() === date2.getUTCMinutes()
  );
};

/**
 * The reports match if the PHR eventDate and the CVIX performedDatePrecise
 * values match to the minute.
 *
 * @param {*} phrResponse a single PHR record
 * @param {*} cvixResponse a single CVIX record
 */
export const radiologyReportsMatch = (phrResponse, cvixResponse) => {
  return areDatesEqualToMinute(
    phrResponse?.eventDate,
    cvixResponse?.performedDatePrecise,
  );
};

/**
 * @param {*} phrResponse a single PHR record from a response
 * @param {*} cvixResponseList a response containing a list of CVIX records
 * @returns the matching CVIX record from the response if one exists, otherwise null
 */
export const findMatchingCvixReport = (phrResponse, cvixResponseList) => {
  if (phrResponse && Array.isArray(cvixResponseList)) {
    for (const cvixResponse of cvixResponseList) {
      if (radiologyReportsMatch(phrResponse, cvixResponse)) {
        return cvixResponse;
      }
    }
  }
  return null;
};

/**
 * Generate a hash for fingerprinting an object. This hash does not need to be cryptographically
 * strong. We used to use crypto.subtle.digest to generate the hash, but that library does not
 * work on non-https connections, limiting testing.
 *
 * @param {string} data
 * @returns a non-cryptographic hash
 */
const generateHash = data => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash * 31 + char) % 2 ** 32;
  }
  return hash.toString(16).padStart(8, '0'); // Convert to hexadecimal, pad to 8 chars
};

/**
 * Normalize a procedure name by replacing newlines and multiple whitespace characters
 * with a single space. This ensures consistent hashing between PHR and CVIX records
 * where procedure names may have different whitespace formatting.
 *
 * @param {string} name the procedure name to normalize
 * @returns {string} the normalized procedure name
 */
export const normalizeProcedureName = name => {
  if (!name) return '';
  return name
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const radiologyRecordHash = record => {
  const { procedureName, radiologist, stationNumber } = record;
  let date = record.eventDate || record.performedDatePrecise;

  if (!Number.isNaN(Number(date))) {
    // If the date is a timestamp, convert it to a date (with no time). This is because subsequent
    // fetches of the same study from CVIX can have timestamps that differ by a few seconds. This
    // ensures the hash will remain consistent across fetches.
    const timestamp = parseInt(date, 10);
    const dateObj = new Date(timestamp);
    [date] = dateObj.toISOString().split('T'); // Extract the date part
  }

  // Normalize procedure name to handle whitespace differences between PHR and CVIX
  const normalizedProcedureName = normalizeProcedureName(procedureName);

  // Use empty string for undefined/null radiologist to ensure consistent hashing
  // between PHR (which has radiologist) and CVIX (which may not have it at top level)
  const normalizedRadiologist = radiologist || '';

  const dataString = `${normalizedProcedureName}|${normalizedRadiologist}|${stationNumber}|${date}`;
  return generateHash(dataString).substring(0, 8);
};

/**
 * @param {*} id the ID (PHR if available, otherwise CVIX) of the desired study, with hash (e.g. (r12345-abcde")
 * @param {*} phrResponse a list of PHR radiology responses from the API
 * @param {*} cvixResponse a list of CVIX radiology responses from the API
 * @returns an object containing the PHR study and CVIX study that match the provided ID
 */
export const findMatchingPhrAndCvixStudies = async (
  id,
  phrResponse,
  cvixResponse,
) => {
  const [numericIdStr, hashId] = id.substring(1).split('-');
  const numericId = +numericIdStr;

  // Helper function to find a record first by numeric ID, then by hash
  const findRecordByIdOrHash = async (records, findNumericId, findHashId) => {
    if (!records) return null;
    const foundRecord = records.find(r => +r.id === findNumericId);
    if (foundRecord) return foundRecord;

    // If not found by ID, compute hashes and find by hash
    const recordsWithHash = await Promise.all(
      records.map(async r => ({
        ...r,
        hash: await radiologyRecordHash(r),
      })),
    );
    return recordsWithHash.find(r => r.hash === findHashId) || null;
  };

  const phrDetails = await findRecordByIdOrHash(phrResponse, numericId, hashId);

  let cvixDetails;
  if (phrDetails) {
    cvixDetails = findMatchingCvixReport(phrDetails, cvixResponse);
  } else {
    cvixDetails = await findRecordByIdOrHash(cvixResponse, numericId, hashId);
  }

  return { phrDetails, cvixDetails };
};
