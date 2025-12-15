import { useCallback } from 'react';
/**
 * @typedef {{ topicId: string, topicName: string }} Topic
 * Default structure for user selections
 * @type {{selectedTopics: Topic[], selectedSlotTime: null}}
 */
const initialSelections = {
  selectedTopics: [], // array of topics
  selectedSlotTime: null, // ISO string
};

/**
 * Generates a unique localStorage key for a given UUID
 * @param {string} uuid - The unique identifier
 * @returns {string} The formatted localStorage key
 */
const getSelectionsStorageKey = uuid => {
  return `vass-selections-${uuid}`;
};

/**
 * Retrieves selections from localStorage for a given UUID
 * @param {string} uuid - The unique identifier
 * @returns {Object} The selections object containing selectedTopics and selectedSlotTime
 */
const getSelections = uuid => {
  const savedSelections = localStorage.getItem(getSelectionsStorageKey(uuid));
  if (savedSelections) {
    try {
      return JSON.parse(savedSelections);
    } catch (error) {
      // clear the unparsable entry from localStorage
      localStorage.removeItem(getSelectionsStorageKey(uuid));
      // TODO log this in DD and remove the console.error
      // eslint-disable-next-line no-console
      console.error('Error parsing selections', error);
      return initialSelections;
    }
  }
  return initialSelections;
};

/**
 * Custom hook for persisting user selections to localStorage
 * @param {string} uuid - A unique identifier for storing selections (e.g., UUID)
 * @returns {Object} An object containing methods to manage persistent selections
 * @returns {Function} returns.saveDateSelection - Saves the selected date/time slot
 * @returns {Function} returns.saveTopicsSelection - Saves the selected topics array
 * @returns {Function} returns.clearSelections - Clears all saved selections for the given UUID
 * @returns {Function} returns.getSaved - Retrieves all saved selections for the given UUID
 */
export const usePersistentSelections = uuid => {
  /**
   * Saves the selected date/time slot to localStorage
   * @param {string|Date} dateTime - The selected date/time value
   */
  const saveDateSelection = dateTime => {
    const selections = getSelections(uuid);
    const newSelections = { ...selections, selectedSlotTime: dateTime };
    localStorage.setItem(
      getSelectionsStorageKey(uuid),
      JSON.stringify(newSelections),
    );
  };

  /**
   * Saves the selected topics array to localStorage
   * @param {Topic[]} selectedTopics - Array of selected topics
   * @typedef {{ topicId: string, topicName: string }} Topic
   */
  const saveTopicsSelection = useCallback(
    selectedTopics => {
      const selections = getSelections(uuid);
      const newSelections = { ...selections, selectedTopics };
      localStorage.setItem(
        getSelectionsStorageKey(uuid),
        JSON.stringify(newSelections),
      );
    },
    [uuid],
  );

  /**
   * Removes all saved selections from localStorage for the given ID
   */
  const clearSelections = () => {
    localStorage.removeItem(getSelectionsStorageKey(uuid));
  };

  /**
   * Retrieves all saved selections from localStorage
   * @returns {Object} Object containing selectedTopics and selectedSlotTime
   */
  const getSaved = useCallback(
    () => {
      return getSelections(uuid);
    },
    [uuid],
  );

  return {
    saveDateSelection,
    saveTopicsSelection,
    clearSelections,
    getSaved,
  };
};
