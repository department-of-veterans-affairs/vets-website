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
 * @param {boolean} holdTimeMessagingUpdate - Feature flag for updated hold time messaging.
 * @returns {string} The generated report content as a string.
 */
export const getTxtContent = (
  data,
  user,
  dateRange,
  failedDomains,
  holdTimeMessagingUpdate,
) => {
  const { userFullName } = user;
  const sections = [
    {
      label: 'Lab and test results',
      data: data?.labsAndTests ?? [],
      parse: parseLabsAndTests,
      isArray: true,
    },
    {
      label: 'Care summaries and notes',
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
      label: 'Health conditions',
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
      label: 'Military service',
      data: data?.militaryService ?? '',
      parse: parseMilitaryService,
      isArray: false,
    },
    {
      label: 'Account summary',
      data: data?.accountSummary ?? null,
      parse: parseAccountSummary,
      isArray: false,
    },
  ];

  // ––– appointment counts & expander helper ––––––––––––––––––––––––––––––––––––
  const apptData = data?.appointments ?? [];
  const pastCount = apptData.filter(a => !a.isUpcoming).length;
  const upcomingCount = apptData.filter(a => a.isUpcoming).length;

  /**
   * Expand “Appointments” or “VA appointments” into Past/Upcoming
   * based on the three modes:
   *   – available: only those with records
   *   – empty: only those without records
   *   – failed: always both
   */
  const expandAppt = (label, mode) => {
    const match =
      mode === 'failed'
        ? label === 'VA appointments'
        : label === 'Appointments';

    if (!match) return [label];

    if (mode === 'failed') {
      return ['Past appointments', 'Upcoming appointments'];
    }

    const out = [];
    if (mode === 'available') {
      if (pastCount > 0) out.push('Past appointments');
      if (upcomingCount > 0) out.push('Upcoming appointments');
    } else if (mode === 'empty') {
      if (pastCount === 0) out.push('Past appointments');
      if (upcomingCount === 0) out.push('Upcoming appointments');
    }
    return out;
  };

  // which sections actually have data
  const nonEmptySections = sections.filter(section =>
    section.isArray ? section.data.length > 0 : Boolean(section.data),
  );

  // –– build emptySections: any truly empty array, PLUS any
  //   Appointments domain where our subset‐empty logic kicks in ––
  const emptySections = sections.filter(section => {
    // skip if it actually failed
    const isAppts = section.label === 'Appointments';
    const failedForThis =
      failedDomains.includes(section.label) ||
      (isAppts && failedDomains.includes('VA appointments'));
    if (failedForThis) return false;

    if (isAppts) {
      // use our subset helper: mode 'empty'
      return expandAppt(section.label, 'empty').length > 0;
    }

    // the normal case
    return section.isArray ? section.data.length === 0 : !section.data;
  });

  // build “in report” list
  const inReport = nonEmptySections
    .flatMap(s => expandAppt(s.label, 'available'))
    .map(l => `  • ${l}`)
    .join('\n');

  // build "failed" list
  const failedList =
    Array.isArray(failedDomains) && failedDomains.length
      ? failedDomains
          .flatMap(d => expandAppt(d, 'failed'))
          .map(l => `  • ${l}`)
          .join('\n')
      : '';

  // assemble the records section
  const recordsParts = [
    'Records in this report',
    '',
    `Date range: ${
      dateRange.fromDate === 'any'
        ? 'All time'
        : `${dateRange.fromDate} to ${dateRange.toDate}`
    }`,
    '',
    inReport,
  ];

  if (emptySections.length) {
    const emptyList = emptySections
      .flatMap(s => expandAppt(s.label, 'empty'))
      .map(l => `  • ${l}`)
      .join('\n');

    recordsParts.push(
      '',
      'Records not in this report',
      '',
      "You don't have any VA medical reports in these categories you selected for this report. If you think you should have records in these categories, contact your VA health facility.",
      '',
      emptyList,
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
    .map((section, idx) => {
      // Pass holdTimeMessagingUpdate to parseLabsAndTests
      if (section.label === 'Lab and test results') {
        return `${txtLine}\n${section.parse(
          section.data,
          idx + 1,
          holdTimeMessagingUpdate,
        )}`;
      }
      return `${txtLine}\n${section.parse(section.data, idx + 1)}`;
    })
    .join('\n\n');

  return `
VA Blue Button® report

This report includes key information from your VA medical records.
${userFullName?.first} ${userFullName?.last}

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
