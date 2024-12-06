import { selfEnteredTypes } from '../../constants';
import { generateActivityJournalContent } from './activityJournal';

export const generateSelfEnteredData = ({
  // vitals,
  // allergies,
  // familyHistory,
  // vaccines,
  // testEntries,
  // medicalEvents,
  // militaryHistory,
  // providers,
  // healthInsurance,
  // treatmentFacilities,
  // foodJournal,
  activityJournal,
  // medications,
  // demographics,
}) => {
  const data = [];

  if (activityJournal) {
    data.push({
      type: selfEnteredTypes.ACTIVITY_JOURNAL,
      title: 'Self-entered activity journal',
      titleParagraphGap: 0,
      titleMoveDownAmount: 0.5,
      records: {
        ...generateActivityJournalContent(activityJournal),
      },
    });
  }

  return data;
};
