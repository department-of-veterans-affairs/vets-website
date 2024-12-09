import { selfEnteredTypes } from '../../constants';
import { generateActivityJournalContent } from './activityJournal';
import { generateAllergiesContent } from './allergies';
import { generateDemographicsContent } from './demographics';
import { generateFamilyHistoryContent } from './familyHistory';
import { generateFoodJournalContent } from './foodJournal';

export const generateSelfEnteredData = ({
  activityJournal,
  allergies,
  demographics,
  familyHistory,
  foodJournal,
  // goals,
  // providers,
  // healthInsurance,
  // testEntries,
  // medicalEvents,
  // medications,
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

  // if (providers) {
  //   console.log('providers: ', providers);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (healthInsurance) {
  //   console.log('healthInsurance: ', healthInsurance);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (testEntries) {
  //   console.log('testEntries: ', testEntries);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (medicalEvents) {
  //   console.log('medicalEvents: ', medicalEvents);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

  // if (medications) {
  //   console.log('medications: ', medications);
  //   data.push({
  //     type: selfEnteredTypes.ASDF,
  //     title: `Self-entered ${selfEnteredTypes.ASDF}`,
  //     subtitles: [`Showing ${ASDF.length} records, from newest to oldest`],
  //     records: ASDF.map(record => generateASDFContent(record)),
  //   });
  // }

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
