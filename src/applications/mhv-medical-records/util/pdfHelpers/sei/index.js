import { selfEnteredTypes } from '../../constants';
import { generateActivityJournalContent } from './activityJournal';

export const generateSelfEnteredData = ({
  activityJournal,
  allergies,
  demographics,
  familyHistory,
  foodJournal,
  goals,
  providers,
  healthInsurance,
  testEntries,
  medicalEvents,
  medications,
  militaryHistory,
  treatmentFacilities,
  vaccines,
  vitals,
}) => {
  const data = [];

  if (activityJournal) {
    data.push({
      type: selfEnteredTypes.ACTIVITY_JOURNAL,
      title: 'Self-entered activity journal',
      subtitles: [
        `Showing ${activityJournal.length} records, from newest to oldest`,
      ],
      records: activityJournal.map(record =>
        generateActivityJournalContent(record),
      ),
    });
  }

  if (allergies) {
    // console.log('allergies: ', allergies);
  }

  if (demographics) {
    // console.log('demographics: ', demographics);
  }
  if (familyHistory) {
    // console.log('familyHistory: ', familyHistory);
  }
  if (foodJournal) {
    // console.log('foodJournal: ', foodJournal);
  }
  if (goals) {
    // console.log('goals: ', goals);
  }
  if (providers) {
    // console.log('providers: ', providers);
  }
  if (healthInsurance) {
    // console.log('healthInsurance: ', healthInsurance);
  }
  if (testEntries) {
    // console.log('testEntries: ', testEntries);
  }
  if (medicalEvents) {
    // console.log('medicalEvents: ', medicalEvents);
  }
  if (medications) {
    // console.log('medications: ', medications);
  }
  if (militaryHistory) {
    // console.log('militaryHistory: ', militaryHistory);
  }
  if (treatmentFacilities) {
    // console.log('treatmentFacilities: ', treatmentFacilities);
  }
  if (vaccines) {
    // console.log('vaccines: ', vaccines);
  }
  if (vitals) {
    // console.log('vitals: ', vitals);
  }

  return data;
};
