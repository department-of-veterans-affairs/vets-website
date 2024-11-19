/**
 * This function was based on RadiologyTransformer.parseRadiologyReport from MHV Classic. It pulls
 * fields out of a text report and puts them into an object.
 *
 * @param {String} radiologyReportText the raw text of a radiology report
 * @returns an object containing information from the report
 */
export const parseRadiologyReport = radiologyReportText => {
  const radiologyReportMap = {};
  const lines = radiologyReportText.split(/\r?\n/);
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
  const date1 = new Date(var1);
  const date2 = new Date(var2);

  if (Number.isNaN(date1) || Number.isNaN(date2)) {
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
  for (const cvixResponse of cvixResponseList) {
    if (radiologyReportsMatch(phrResponse, cvixResponse)) {
      return cvixResponse;
    }
  }
  return null;
};
