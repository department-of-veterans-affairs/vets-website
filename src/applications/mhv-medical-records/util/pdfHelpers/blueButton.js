import { labTypes, loincCodes, recordType } from '../constants';
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

export const generateBlueButtonData = ({
  labsAndTests,
  notes,
  vaccines,
  allergies,
  conditions,
  vitals,
}) => {
  const data = [];

  if (labsAndTests.length) {
    data.push({
      type: recordType.LABS_AND_TESTS,
      title: 'Lab and test results',
      subtitles: [
        "If your results are outside the reference range, this doesn't automatically mean you have a health problem. Your provider will explain what your results mean for your health.",
      ],
      toc: {
        title: 'Lab and test results…………………………………………',
        subtitle: 'Review lab and test results in your VA medical records.',
      },
      records: labsAndTests.map(record => {
        const title = `${record.name} on ${record.date}`;
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
      toc: {
        title: 'Care summaries and notes………………………………',
        subtitle:
          'Review notes from your VA providers about your health and health care.',
      },
      records: notes.map(record => {
        const title = record.name;
        let content;

        if (record.type === loincCodes.DISCHARGE_SUMMARY) {
          content = generateDischargeSummaryContent(record);
        }
        if (record.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE) {
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
      toc: {
        title: 'Vaccines……………………………………………………………',
        subtitle:
          'Review a list of all vaccines (immunizations) in your VA medical records.',
      },
      records: generateVaccinesContent(vaccines),
    });
  }

  if (allergies.length) {
    data.push({
      type: recordType.ALLERGIES,
      title: 'Allergies',
      subtitles: [
        'If you have allergies that are missing from this list, send a secure message to your care team.',
      ],
      toc: {
        title: 'Allergies…………………………………………………………',
        subtitle:
          'Review a list of all allergies, reactions, and side effects in your VA medical records.',
      },
      records: generateAllergiesContent(allergies),
    });
  }

  if (conditions.length) {
    data.push({
      title: 'Health conditions',
      subtitles: [
        'This list includes your current health conditions that VA providers are helping you manage. It may not include conditions non-VA providers are helping you manage.',
      ],
      toc: {
        title: 'Health conditions……………………………………………',
        subtitle:
          'Review a list of all health conditions in your VA medical records.',
      },
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
      toc: {
        title: 'Vitals…………………………………………………………………',
        subtitle:
          'Review a list of vitals and other basic health numbers your providers check at your appointments. This includes your blood pressure, breathing rate, heart rate, height, temperature, pain level, and weight.',
      },
      records: generateVitalsContentByType(vitals),
    });
  }

  return data;
};
