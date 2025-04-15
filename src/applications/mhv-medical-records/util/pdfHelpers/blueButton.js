import {
  blueButtonRecordTypes,
  labTypes,
  loincCodes,
  recordType,
} from '../constants';
import {
  generateChemHemContent,
  generateEkgContent,
  generateMicrobioContent,
  generatePathologyContent,
  generateRadiologyContent,
} from './labsAndTests';
import {
  generateDischargeSummaryContent,
  generateProgressNoteContent,
} from './notes';
import { generateVaccinesContent } from './vaccines';
import { generateAllergiesContent } from './allergies';
import { generateConditionContent } from './conditions';
import { generateVitalsContentByType } from './vitals';
import { isArrayAndHasItems } from '../helpers';
import { generateMedicationsContent } from './medications';
import { generateAppointmentsContent } from './appointments';
import { generateDemographicsContent } from './demographics';
import { generateMilitaryServiceContent } from './militaryService';
import { generateAccountSummaryContent } from './accountSummary';

export const generateBlueButtonData = (
  {
    labsAndTests,
    notes,
    vaccines,
    allergies,
    conditions,
    vitals,
    medications,
    appointments,
    demographics,
    militaryService,
    accountSummary,
  },
  recordFilter,
) => {
  const data = [];

  data.push({
    type: recordType.LABS_AND_TESTS,
    title: 'Lab and test results',
    subtitles: [
      'Most lab and test results are available 36 hours after the lab confirms them. Pathology results may take 14 days or longer to confirm.',
      'If you have questions about these results, send a secure message to your care team.',
      'Note: If you have questions about more than 1 test ordered by the same care team, send 1 message with all of your questions.',
      `Showing ${labsAndTests?.length} records from newest to oldest`,
    ],
    selected: recordFilter.includes('labTests'),
    records:
      isArrayAndHasItems(labsAndTests) && labsAndTests.length > 0
        ? labsAndTests.map(record => {
            const title = record.name;
            let content;

            if (record.type === labTypes.CHEM_HEM) {
              content = generateChemHemContent(record);
            }
            if (record.type === labTypes.MICROBIOLOGY) {
              content = generateMicrobioContent(record);
            }
            if (record.type === labTypes.PATHOLOGY) {
              content = generatePathologyContent(record);
            }
            if (record.type === labTypes.EKG) {
              content = generateEkgContent(record);
            }
            if (record.type === labTypes.RADIOLOGY) {
              content = generateRadiologyContent(record);
            }
            return { title, ...content };
          })
        : [],
  });

  data.push({
    type: recordType.CARE_SUMMARIES_AND_NOTES,
    title: 'Care summaries and notes',
    subtitles: [
      'This report only includes care summaries and notes from 2013 and later.',
      'For after-visit summaries, (summaries of your appointments with VA providers), go to your appointment records.',
      `Showing ${notes?.length} records from newest to oldest`,
    ],
    selected: recordFilter.includes('careSummaries'),
    records: notes?.length
      ? notes.map(record => {
          const title = record.name;
          let content;

          if (record.type === loincCodes.DISCHARGE_SUMMARY) {
            content = generateDischargeSummaryContent(record);
          }
          if (
            record.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE ||
            record.type === loincCodes.CONSULT_RESULT
          ) {
            content = generateProgressNoteContent(record);
          }
          return { title, ...content };
        })
      : [],
  });

  data.push({
    type: recordType.VACCINES,
    title: 'Vaccines',
    subtitles: [
      'This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records.',
      `Showing ${vaccines?.length} records from newest to oldest`,
    ],
    selected: recordFilter.includes('vaccines'),
    records: vaccines?.length ? generateVaccinesContent(vaccines) : [],
  });

  data.push({
    type: recordType.ALLERGIES,
    title: 'Allergies and reactions',
    subtitles: [
      'This list includes all allergies, reactions, and side effects in your VA medical records. If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
      `Showing ${allergies?.length} records from newest to oldest`,
    ],
    selected:
      recordFilter.includes('allergies') ||
      (recordFilter.includes('medications') && medications?.length > 0),
    records: allergies?.length ? generateAllergiesContent(allergies) : [],
  });

  data.push({
    title: 'Health conditions',
    subtitles: [
      'Health conditions are available 36 hours after your providers enter them.',
      'About the codes in some condition names: Some of your health conditions may have diagnosis codes in the name that start with SCT or ICD. Providers use these codes to track your health conditions and to communicate with other providers about your care. If you have a question about these codes or a health condition, ask your provider at your next appointment.',
      `Showing ${conditions?.length} records from newest to oldest`,
    ],
    selected: recordFilter.includes('conditions'),
    records: conditions?.length
      ? conditions.map(record => {
          const title = record.name;
          const content = generateConditionContent(record);
          return { title, ...content };
        })
      : [],
  });

  if (vitals?.length > 0) {
    data.push({
      type: recordType.VITALS,
      title: 'Vitals',
      subtitles: [
        'Vitals are basic health numbers your providers check at your appointments.',
      ],
      selected: recordFilter.includes('vitals'),
      records: generateVitalsContentByType(vitals),
    });
  }

  data.push({
    type: blueButtonRecordTypes.MEDICATIONS,
    title: 'Medications',
    subtitles: [
      'This is a list of prescriptions and other medications in your VA medical records.',
      'When you share your medications list with providers, make sure you also tell them about your allergies and reactions to medications. When you download medications records, we also include a list of allergies and reactions in your VA medical records.',
      `Showing ${medications?.length} medications, alphabetically by name`,
    ],
    selected: recordFilter.includes('medications'),
    records: medications?.length
      ? medications.map(record => {
          const title = record.prescriptionName;
          const content = generateMedicationsContent(record);
          return { title, ...content };
        })
      : [],
  });

  const upcoming =
    appointments?.length && recordFilter.includes('upcomingAppts')
      ? appointments.filter(appt => appt.isUpcoming)
      : [];

  const past =
    appointments?.length && recordFilter.includes('pastAppts')
      ? appointments.filter(appt => !appt.isUpcoming)
      : [];

  const records = [];

  if (upcoming.length > 0) {
    records.push({
      title: 'Upcoming appointments',
      ...generateAppointmentsContent(upcoming),
    });
  }

  if (past.length > 0) {
    records.push({
      title: 'Past appointments',
      ...generateAppointmentsContent(past),
    });
  }

  if (records.length > 0) {
    data.push({
      type: blueButtonRecordTypes.APPOINTMENTS,
      title: 'Appointments',
      subtitles: [
        'Your VA appointments may be by telephone, video, or in person. Always bring your insurance information with you to your appointment.',
      ],
      selected:
        recordFilter.includes('upcomingAppts') ||
        recordFilter.includes('pastAppts'),
      records,
    });
  }

  data.push({
    type: blueButtonRecordTypes.DEMOGRAPHICS,
    title: 'Demographics',
    subtitles: [
      'Each of your VA facilities may have different demographic information for you. If you need update your information, contact your facility.',
    ],
    selected: recordFilter.includes('demographics'),
    records: demographics?.length
      ? demographics.map(record => ({
          title: `VA facility: ${record.facility}`,
          titleMoveDownAmount: 0.5,
          ...generateDemographicsContent(record),
        }))
      : [],
  });

  const militaryServiceContent = militaryService?.length
    ? generateMilitaryServiceContent(militaryService)
    : {};
  data.push({
    type: blueButtonRecordTypes.MILITARY_SERVICE,
    title: 'DOD military service information',
    titleParagraphGap: 0,
    titleMoveDownAmount: 0.5,
    selected: recordFilter.includes('militaryService'),
    records: [
      {
        ...militaryServiceContent,
      },
    ],
  });

  const accountSummaryContent = accountSummary
    ? generateAccountSummaryContent(accountSummary)
    : {};
  data.push({
    type: blueButtonRecordTypes.ACCOUNT_SUMMARY,
    title: 'My HealtheVet account summary',
    titleParagraphGap: 0,
    titleMoveDownAmount: 0.5,
    selected: true,
    records: {
      ...accountSummaryContent,
    },
  });

  return data;
};
