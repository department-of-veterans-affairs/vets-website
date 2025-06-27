import {
  txtLine,
  txtLineDotted,
  formatUserDob,
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

/**
 * Helper function to parse consolidated downloads data for txt files.
 *
 * @param {Object} data - The data from content downloads.
 * @param {Object} user - The user object, containing userFullName and date of birth.
 * @param {Object} dateRange - The selected date range for the report.
 * @param {string[]} failedDomains - Labels of sections that failed to load.
 * @returns {string} The generated report content as a string.
 */
export const getTxtContent = (data, user, dateRange, failedDomains) => {
  const { userFullName } = user;
  const sections = [
    {
      label: 'Labs and Tests',
      data: data?.labsAndTests ?? [],
      parse: parseLabsAndTests,
      isArray: true,
    },
    {
      label: 'Care Summaries and Notes',
      data: data?.notes ?? [],
      parse: parseCareSummariesAndNotes,
      isArray: true,
    },
    {
      label: 'Vaccines',
      data: data?.vaccines ?? [],
      parse: parseVaccines,
      isArray: true,
    },
    {
      label: 'Allergies',
      data: data?.allergies ?? [],
      parse: parseAllergies,
      isArray: true,
    },
    {
      label: 'Health Conditions',
      data: data?.conditions ?? [],
      parse: parseHealthConditions,
      isArray: true,
    },
    {
      label: 'Vitals',
      data: data?.vitals ?? [],
      parse: parseVitals,
      isArray: true,
    },
    {
      label: 'Medications',
      data: data?.medications ?? [],
      parse: parseMedications,
      isArray: true,
    },
    {
      label: 'Appointments',
      data: data?.appointments ?? [],
      parse: parseAppointments,
      isArray: true,
    },
    {
      label: 'Demographics',
      data: data?.demographics ?? [],
      parse: parseDemographics,
      isArray: true,
    },
    {
      label: 'Military Service',
      data: data?.militaryService ?? '',
      parse: parseMilitaryService,
      isArray: false,
    },
    {
      label: 'Account Summary',
      data: data?.accountSummary ?? null,
      parse: parseAccountSummary,
      isArray: false,
    },
  ];

  const dateRangeText = `Date range: ${
    dateRange.fromDate === 'any'
      ? 'All time'
      : `${dateRange.fromDate} to ${dateRange.toDate}`
  }`;

  // Sections with data (arrays with items, or non-array truthy)
  const nonEmptySections = sections.filter(
    section =>
      section.isArray ? section.data.length > 0 : Boolean(section.data),
  );

  // Sections selected but empty (arrays empty, or non-array falsey), excluding failures
  const emptySections = sections.filter(section => {
    const noData = section.isArray ? section.data.length === 0 : !section.data;
    return noData && !failedDomains.includes(section.label);
  });

  // Build bullet list of included sections
  const inReport = nonEmptySections.map(s => `  • ${s.label}`).join('\n');

  // Build bullet list of failed domains
  const failedList = failedDomains.length
    ? failedDomains.map(d => `  • ${d}`).join('\n')
    : '';

  // Assemble records section lines
  const recordsParts = [
    'Records in this report',
    '',
    dateRangeText,
    '',
    inReport,
  ];

  if (emptySections.length) {
    recordsParts.push(
      '',
      'Records not in this report',
      '',
      "You don't have any VA medical reports in these categories you selected for this report. If you think you should have records in these categories, contact your VA health facility.",
      '',
      emptySections.map(s => `  • ${s.label}`).join('\n'),
    );
  }

  if (failedList) {
    recordsParts.push(
      '',
      "Information we can't access right now",
      '',
      "We're sorry, there was a problem with our system. Try downloading your report again later.",
      '',
      failedList,
    );
  }

  const recordsSection = recordsParts.join('\n');

  // Detailed content for each non-empty section
  const contentSection = nonEmptySections
    .map(
      (section, idx) => `${txtLine}\n${section.parse(section.data, idx + 1)}`,
    )
    .join('\n\n');

  return `
VA Blue Button® report

This report includes key information from your VA medical records.
${userFullName.first} ${userFullName.last}

Date of birth: ${formatUserDob(user)}

What to know about your Blue Button report
- If you print or download your Blue Button report, you'll need to take responsibility for protecting the information in the report.
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
