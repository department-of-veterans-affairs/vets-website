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

export const generateBlueButtonData = ({
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
}) => {
  const data = [];

  if (isArrayAndHasItems(labsAndTests) && labsAndTests.length > 0) {
    data.push({
      type: recordType.LABS_AND_TESTS,
      title: 'Lab and test results',
      subtitles: [
        'Most lab and test results are available 36 hours after the lab confirms them. Pathology results may take 14 days or longer to confirm.',
        'If you have questions about these results, send a secure message to your care team.',
        'Note: If you have questions about more than 1 test ordered by the same care team, send 1 message with all of your questions.',
        `Showing ${labsAndTests.length} records from newest to oldest`,
      ],
      // toc: {
      //   title: 'Lab and test results…………………………………………',
      //   subtitle: 'Review lab and test results in your VA medical records.',
      // },
      records: labsAndTests.map(record => {
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
      }),
    });
  }

  if (notes.length) {
    data.push({
      type: recordType.CARE_SUMMARIES_AND_NOTES,
      title: 'Care summaries and notes',
      subtitles: [
        'This report only includes care summaries and notes from 2013 and later.',
        'For after-visit summaries, (summaries of your appointments with VA providers), go to your appointment records.',
      ],
      // toc: {
      //   title: 'Care summaries and notes………………………………',
      //   subtitle:
      //     'Review notes from your VA providers about your health and health care.',
      // },
      records: notes.map(record => {
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
      }),
    });
  }

  if (vaccines.length) {
    data.push({
      type: recordType.VACCINES,
      title: 'Vaccines',
      subtitles: [
        'This list includes vaccines you got at VA health facilities and from providers or pharmacies in our community care network. It may not include vaccines you got outside our network.',
        'For complete records of your allergies and reactions to vaccines, review your allergy records in this report.',
      ],
      // toc: {
      //   title: 'Vaccines……………………………………………………………',
      //   subtitle:
      //     'Review a list of all vaccines (immunizations) in your VA medical records.',
      // },
      records: generateVaccinesContent(vaccines),
    });
  }

  if (allergies.length) {
    data.push({
      type: recordType.ALLERGIES,
      title: 'Allergies and reactions',
      subtitles: [
        'This list includes all allergies, reactions, and side effects in your VA medical records. If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
        `Showing ${allergies.length} records from newest to oldest`,
      ],
      // toc: {
      //   title: 'Allergies…………………………………………………………',
      //   subtitle:
      //     'Review a list of all allergies, reactions, and side effects in your VA medical records.',
      // },
      records: generateAllergiesContent(allergies),
    });
  }

  if (conditions.length) {
    data.push({
      title: 'Health conditions',
      subtitles: [
        'This list includes your current health conditions that VA providers are helping you manage. It may not include conditions non-VA providers are helping you manage.',
      ],
      // toc: {
      //   title: 'Health conditions……………………………………………',
      //   subtitle:
      //     'Review a list of all health conditions in your VA medical records.',
      // },
      records: conditions.map(record => {
        const title = record.name;
        const content = generateConditionContent(record);
        return { title, ...content };
      }),
    });
  }

  if (vitals.length) {
    data.push({
      type: recordType.VITALS,
      title: 'Vitals',
      subtitles: [
        'This list includes vitals and other basic health numbers your providers check at your appointments.',
      ],
      // toc: {
      //   title: 'Vitals…………………………………………………………………',
      //   subtitle:
      //     'Review a list of vitals and other basic health numbers your providers check at your appointments. This includes your blood pressure, breathing rate, heart rate, height, temperature, pain level, and weight.',
      // },
      records: generateVitalsContentByType(vitals),
    });
  }

  if (medications.length) {
    data.push({
      type: blueButtonRecordTypes.MEDICATIONS,
      title: 'Medications',
      subtitles: [
        'This is a list of prescriptions and other medications in your VA medical records.',
        'When you share your medications list with providers, make sure you also tell them about your allergies and reactions to medications. When you download medications records, we also include a list of allergies and reactions in your VA medical records.',
        `Showing ${medications.length} medications, alphabetically by name`,
      ],
      records: medications.map(record => {
        const title = record.prescriptionName;
        const content = generateMedicationsContent(record);
        return { title, ...content };
      }),
    });
  }

  if (appointments.length) {
    const upcoming = appointments.filter(appt => appt.isUpcoming);
    const past = appointments.filter(appt => !appt.isUpcoming);

    data.push({
      type: blueButtonRecordTypes.APPOINTMENTS,
      title: 'Appointments',
      subtitles: [
        'Your VA appointments may be by telephone, video, or in person. Always bring your insurance information with you to your appointment.',
      ],
      records: [
        {
          title: 'Upcoming appointments',
          ...generateAppointmentsContent(upcoming),
        },
        {
          title: 'Past appointments',
          ...generateAppointmentsContent(past),
        },
      ],
    });
  }

  if (demographics.length) {
    data.push({
      type: blueButtonRecordTypes.DEMOGRAPHICS,
      title: 'Demographics',
      subtitles: [
        'Each of your VA facilities may have different demographic information for you. If you need update your information, contact your facility.',
      ],
      records: demographics.map(record => ({
        title: `VA facility: ${record.facility}`,
        titleMoveDownAmount: 0.5,
        ...generateDemographicsContent(record),
      })),
    });
  }

  if (militaryService.length) {
    data.push({
      type: blueButtonRecordTypes.MILITARY_SERVICE,
      title: 'DOD military service information',
      titleParagraphGap: 0,
      titleMoveDownAmount: 0.5,
      records: [
        {
          ...generateMilitaryServiceContent(militaryService),
        },
      ],
    });
  }

  if (accountSummary) {
    data.push({
      type: blueButtonRecordTypes.ACCOUNT_SUMMARY,
      title: 'My HealtheVet account summary',
      titleParagraphGap: 0,
      titleMoveDownAmount: 0.5,
      records: {
        ...generateAccountSummaryContent(accountSummary),
      },
    });
  }

  return data;
};
