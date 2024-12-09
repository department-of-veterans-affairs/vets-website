import { selfEnteredTypes } from '../../constants';
import { generateActivityJournalContent } from './activityJournal';
import { generateAllergiesContent } from './allergies';
import { generateDemographicsContent } from './demographics';
import { generateFamilyHistoryContent } from './familyHistory';
import { generateFoodJournalContent } from './foodJournal';
import { generateHealthInsuranceContent } from './healthInsurance';
import { generateHealthProvidersContent } from './healthProviders';
import { generateMedicalEventsContent } from './medicalEvents';
import { generateMedicationsContent } from './medications';
import { generateTestEntriesContent } from './testEntries';

export const generateSelfEnteredData = ({
  activityJournal,
  allergies,
  demographics,
  familyHistory,
  foodJournal,
  // goals,
  providers,
  healthInsurance,
  testEntries,
  medicalEvents,
  medications,
  // militaryHistory,
  // treatmentFacilities,
  // vaccines,
  // vitals,
}) => {
  const data = [];

  if (activityJournal) {
    data.push({
      type: selfEnteredTypes.ACTIVITY_JOURNAL,
      title: `Self-entered ${selfEnteredTypes.ACTIVITY_JOURNAL}`,
      subtitles: [
        `Showing ${activityJournal.length} records, from newest to oldest`,
      ],
      records: activityJournal.map(record =>
        generateActivityJournalContent(record),
      ),
    });
  }

  if (allergies) {
    data.push({
      type: selfEnteredTypes.ALLERGIES,
      title: `Self-entered ${selfEnteredTypes.ALLERGIES}`,
      subtitles: [
        'Remember to share all information about your allergies with your health care team',
        `Showing ${allergies.length} records, from newest to oldest`,
      ],
      records: allergies.map(record => generateAllergiesContent(record)),
    });
  }

  if (demographics) {
    data.push({
      type: selfEnteredTypes.DEMOGRAPHICS,
      title: `Self-entered ${selfEnteredTypes.DEMOGRAPHICS}`,
      records: generateDemographicsContent(demographics),
    });
  }

  if (familyHistory) {
    data.push({
      type: selfEnteredTypes.FAMILY_HISTORY,
      title: `Self-entered ${selfEnteredTypes.FAMILY_HISTORY}`,
      subtitles: [
        `Showing ${
          familyHistory.length
        } records, alphabetically by relationship`,
      ],
      records: familyHistory.map(record =>
        generateFamilyHistoryContent(record),
      ),
    });
  }

  if (foodJournal) {
    data.push({
      type: selfEnteredTypes.FOOD_JOURNAL,
      title: `Self-entered ${selfEnteredTypes.FOOD_JOURNAL}`,
      subtitles: [
        `Showing ${foodJournal.length} records, from newest to oldest`,
      ],
      records: foodJournal.map(record => generateFoodJournalContent(record)),
    });
  }

  // if (goals) {
  //   console.log('goals: ', goals);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  if (providers) {
    data.push({
      type: selfEnteredTypes.HEALTH_PROVIDERS,
      title: `Self-entered ${selfEnteredTypes.HEALTH_PROVIDERS}`,
      subtitles: [
        `Showing ${providers.length} records, alphabetically by last name`,
      ],
      records: providers.map(record => generateHealthProvidersContent(record)),
    });
  }

  if (healthInsurance) {
    data.push({
      type: selfEnteredTypes.HEALTH_INSURANCE,
      title: `Self-entered ${selfEnteredTypes.HEALTH_INSURANCE}`,
      subtitles: [
        `Showing ${healthInsurance.length} records, alphabetically by name`,
      ],
      records: healthInsurance.map(record =>
        generateHealthInsuranceContent(record),
      ),
    });
  }

  if (testEntries) {
    data.push({
      type: selfEnteredTypes.TEST_ENTRIES,
      title: `Self-entered ${selfEnteredTypes.TEST_ENTRIES}`,
      subtitles: [
        `Showing ${testEntries.length} records, from newest to oldest`,
      ],
      records: testEntries.map(record => generateTestEntriesContent(record)),
    });
  }

  if (medicalEvents) {
    data.push({
      type: selfEnteredTypes.MEDICAL_EVENTS,
      title: `Self-entered ${selfEnteredTypes.MEDICAL_EVENTS}`,
      subtitles: [
        `Showing ${
          medicalEvents.length
        } records, from newest to oldest start date`,
      ],
      records: medicalEvents.map(record =>
        generateMedicalEventsContent(record),
      ),
    });
  }

  if (medications) {
    data.push({
      type: selfEnteredTypes.MEDICATIONS,
      title: `Self-entered ${selfEnteredTypes.MEDICATIONS}`,
      subtitles: [
        `Showing ${medications.length} records, alphabetically by name`,
      ],
      records: medications.map(record => generateMedicationsContent(record)),
    });
  }

  // if (militaryHistory) {
  //   console.log('militaryHistory: ', militaryHistory);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (treatmentFacilities) {
  //   console.log('treatmentFacilities: ', treatmentFacilities);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (vaccines) {
  //   console.log('vaccines: ', vaccines);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (vitals) {
  //   console.log('vitals: ', vitals);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }
  return data;
};
