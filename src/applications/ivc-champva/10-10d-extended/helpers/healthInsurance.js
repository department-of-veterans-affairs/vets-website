import { toHash } from '../../shared/utilities';
import { formatFullName } from './formatting';
import content from '../locales/en/content.json';

const MSG_NO_MEMBERS = content['health-insurance--participant-list-empty'];

/**
 * Generates a comma-separated list of participant names for a health insurance item.
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.item - Health insurance item with healthcareParticipants
 * @param {Array} params.applicants - Array of all applicants
 * @returns {string} Comma-separated participant names or default message
 */
export const generateParticipantNames = ({ item, applicants = [] }) => {
  if (!item?.healthcareParticipants || !applicants.length) {
    return MSG_NO_MEMBERS;
  }

  const selectedParticipants = applicants
    .filter(a => {
      const hash = toHash(a.applicantSsn);
      return item.healthcareParticipants[hash] === true;
    })
    .map(a => formatFullName(a.applicantName));

  return selectedParticipants.length > 0
    ? selectedParticipants.join(', ')
    : MSG_NO_MEMBERS;
};
