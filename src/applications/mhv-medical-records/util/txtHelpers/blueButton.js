import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';
import { parseLabsAndTests } from './labsAndTests';
import { parseCareSummariesAndNotes } from './notes';
import { parseVaccines } from './vaccines';
import { parseAllergies } from './allergies';
import { parseHealthConditions } from './conditions';
import { parseVitals } from './vitals';

// TODO: figure out a way to reduce complexity of the functions in this file
/**
 * Helper function to parse consolidated downloads data for txt files.
 *
 * @param {Object} data - The data from content downloads.
 * @returns a string parsed from the data being passed for all record downloads txt.
 */
export const getTxtContent = (data, { userFullName, dob }) => {
  return `
Blue Button report

This report includes key information from your VA medical records.
${userFullName.last}, ${userFullName.first}\n
Date of birth: ${dob}\n

What to know about your Blue Button report
- If you print or download your Blue Button report, you'll need to take responsibility for protecting the information in the report.
- Some records in this report are available 36 hours after providers enter them. This includes care summaries and notes, health condition records, and most lab and test results.
- This report doesn't include information you entered yourself. To find information you entered yourself, go back to the previous version of Blue Button on the My HealtheVet website.

Need help?
- If you have questions about this report or you need to add information to your records, send a secure message to your care team.
- If you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.

${txtLine}
The following records have been downloaded:
${txtLineDotted}
  1. Labs and Tests
  2. Care Summaries and Notes
  3. Vaccines
  4. Allergies
  5. Health Conditions
  6. Vitals

${parseLabsAndTests(data.labsAndTests)}
${parseCareSummariesAndNotes(data.notes)}
${parseVaccines(data.vaccines)}
${parseAllergies(data.allergies)}
${parseHealthConditions(data.conditions)}
${parseVitals(data.vitals)}
`;
};
