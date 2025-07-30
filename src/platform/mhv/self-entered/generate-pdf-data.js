import { selfEnteredDocSections } from '../util/constants';
import { generateActivityJournalContent } from './pdf-helpers/activityJournal';
import { generateAllergiesContent } from './pdf-helpers/allergies';
import { generateDemographicsContent } from './pdf-helpers/demographics';
import { generateFamilyHistoryContent } from './pdf-helpers/familyHistory';
import { generateFoodJournalContent } from './pdf-helpers/foodJournal';
import { generateHealthInsuranceContent } from './pdf-helpers/healthInsurance';
import { generateHealthProvidersContent } from './pdf-helpers/healthProviders';
import { generateMedicalEventsContent } from './pdf-helpers/medicalEvents';
import { generateMedicationsContent } from './pdf-helpers/medications';
import { generateMilitaryHistoryContent } from './pdf-helpers/militaryHistory';
import { generateTestEntriesContent } from './pdf-helpers/testEntries';
import { generateTreatmentFacilitiesContent } from './pdf-helpers/treatmentFacilities';
import { generateVaccinesContent } from './pdf-helpers/vaccines';
import { generateVitalsContent } from './pdf-helpers/vitals';

export const generateSelfEnteredData = ({
  activityJournal,
  allergies,
  demographics,
  emergencyContacts,
  familyHistory,
  foodJournal,
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
      type: selfEnteredDocSections.ACTIVITY_JOURNAL,
      title: `Self-entered ${selfEnteredDocSections.ACTIVITY_JOURNAL}`,
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
      type: selfEnteredDocSections.ALLERGIES,
      title: `Self-entered ${selfEnteredDocSections.ALLERGIES}`,
      subtitles: [
        'Remember to share all information about your allergies with your health care team.',
        `Showing ${allergies.length} records, from newest to oldest`,
      ],
      records: allergies.map(record => generateAllergiesContent(record)),
    });
  }

  if (demographics && emergencyContacts) {
    data.push({
      type: selfEnteredDocSections.DEMOGRAPHICS,
      title: `Self-entered ${selfEnteredDocSections.DEMOGRAPHICS}`,
      titleMoveDownAmount: 0,
      titleParagraphGap: 0,
      records: generateDemographicsContent({
        ...demographics,
        emergencyContacts,
      }),
    });
  }

  if (familyHistory) {
    data.push({
      type: selfEnteredDocSections.FAMILY_HISTORY,
      title: `Self-entered ${selfEnteredDocSections.FAMILY_HISTORY}`,
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
      type: selfEnteredDocSections.FOOD_JOURNAL,
      title: `Self-entered ${selfEnteredDocSections.FOOD_JOURNAL}`,
      subtitles: [
        `Showing ${foodJournal.length} records, from newest to oldest`,
      ],
      records: foodJournal.map(record => generateFoodJournalContent(record)),
    });
  }

  if (providers) {
    data.push({
      type: selfEnteredDocSections.HEALTH_PROVIDERS,
      title: `Self-entered ${selfEnteredDocSections.HEALTH_PROVIDERS}`,
      subtitles: [
        `Showing ${providers.length} records, alphabetically by last name`,
      ],
      records: providers.map(record => generateHealthProvidersContent(record)),
    });
  }

  if (healthInsurance) {
    data.push({
      type: selfEnteredDocSections.HEALTH_INSURANCE,
      title: `Self-entered ${selfEnteredDocSections.HEALTH_INSURANCE}`,
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
      type: selfEnteredDocSections.TEST_ENTRIES,
      title: `Self-entered ${selfEnteredDocSections.TEST_ENTRIES}`,
      subtitles: [
        `Showing ${testEntries.length} records, from newest to oldest`,
      ],
      records: testEntries.map(record => generateTestEntriesContent(record)),
    });
  }

  if (medicalEvents) {
    data.push({
      type: selfEnteredDocSections.MEDICAL_EVENTS,
      title: `Self-entered ${selfEnteredDocSections.MEDICAL_EVENTS}`,
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
      type: selfEnteredDocSections.MEDICATIONS,
      title: `Self-entered ${selfEnteredDocSections.MEDICATIONS}`,
      subtitles: [
        `Showing ${medications.length} records, alphabetically by name`,
      ],
      records: medications.map(record => generateMedicationsContent(record)),
    });
  }

  if (militaryHistory) {
    data.push({
      type: selfEnteredDocSections.MILITARY_HISTORY,
      title: `Self-entered ${selfEnteredDocSections.MILITARY_HISTORY}`,
      subtitles: [
        `Showing ${militaryHistory.length} records, from newest to oldest`,
      ],
      records: militaryHistory.map(record =>
        generateMilitaryHistoryContent(record),
      ),
    });
  }

  if (treatmentFacilities) {
    data.push({
      type: selfEnteredDocSections.TREATMENT_FACILITIES,
      title: `Self-entered ${selfEnteredDocSections.TREATMENT_FACILITIES}`,
      subtitles: [
        `Showing ${treatmentFacilities.length} records, alphabetically by name`,
      ],
      records: treatmentFacilities.map(record =>
        generateTreatmentFacilitiesContent(record),
      ),
    });
  }

  if (vaccines) {
    data.push({
      type: selfEnteredDocSections.VACCINES,
      title: `Self-entered ${selfEnteredDocSections.VACCINES}`,
      subtitles: [`Showing ${vaccines.length} records, from newest to oldest`],
      records: vaccines.map(record => generateVaccinesContent(record)),
    });
  }

  if (vitals) {
    data.push({
      type: selfEnteredDocSections.VITALS,
      title: `Self-entered ${selfEnteredDocSections.VITALS}`,
      records: generateVitalsContent(vitals),
    });
  }
  return data;
};
