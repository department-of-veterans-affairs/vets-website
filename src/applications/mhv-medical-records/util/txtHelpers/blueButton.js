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
import { parseMedications } from './medications';
import { parseAppointments } from './appointments';
import { parseDemographics } from './demographics';
import { parseMilitaryService } from './militaryService';
import { parseAccountSummary } from './accountSummary';
import { formatUserDob } from '../helpers';

// TODO: figure out a way to reduce complexity of the functions in this file
/**
 * Helper function to parse consolidated downloads data for txt files.
 *
 * @param {Object} data - The data from content downloads.
 * @returns a string parsed from the data being passed for all record downloads txt.
 */
export const getTxtContent = (data, user, dateRange) => {
  const { userFullName } = user;
  const sections = [
    {
      label: 'Labs and Tests',
      data: data?.labsAndTests,
      parse: parseLabsAndTests,
    },
    {
      label: 'Care Summaries and Notes',
      data: data?.notes,
      parse: parseCareSummariesAndNotes,
    },
    { label: 'Vaccines', data: data?.vaccines, parse: parseVaccines },
    { label: 'Allergies', data: data?.allergies, parse: parseAllergies },
    {
      label: 'Health Conditions',
      data: data?.conditions,
      parse: parseHealthConditions,
    },
    { label: 'Vitals', data: data?.vitals, parse: parseVitals },
    { label: 'Medications', data: data?.medications, parse: parseMedications },
    {
      label: 'Appointments',
      data: data?.appointments,
      parse: parseAppointments,
    },
    {
      label: 'Demographics',
      data: data?.demographics,
      parse: parseDemographics,
    },
    {
      label: 'Military Service',
      data: data?.militaryService,
      parse: parseMilitaryService,
    },
    {
      label: 'Account Summary',
      data: data?.accountSummary,
      parse: parseAccountSummary,
    },
  ];

  const dateRangeText = `Date range: ${
    dateRange.fromDate === 'any'
      ? 'All time'
      : `${dateRange.fromDate} to ${dateRange.toDate}`
  }`;

  const inReport = sections
    .filter(section => section.data)
    .map(section => `  • ${section.label}`)
    .join('\n');

  const notInReportList = sections
    .filter(section => !section.data)
    .map(section => `  • ${section.label}`)
    .join('\n');

  const recordsSection = `Records in this report\n\n${dateRangeText}\n\n${inReport}${
    notInReportList ? `\n\nRecords not in this report\n${notInReportList}` : ''
  }`;

  const contentSection = sections
    .filter(section => section.data)
    .map(
      (section, index) =>
        `${txtLine}\n${section.parse(section.data, index + 1)}`,
    )
    .join('\n\n');

  return `
VA Blue Button® report

This report includes key information from your VA medical records.
${userFullName.first} ${userFullName.last}\n
Date of birth: ${formatUserDob(user)}\n

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

${recordsSection}

${contentSection}
`;
};
