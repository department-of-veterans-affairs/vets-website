/**
 * Default structure for user selections
 * @type {{selectedTopics: Array, selectedSlotTime: null}}
 */
const initialSelections = {
  selectedTopics: [],
  selectedSlotTime: null,
};

/**
 * Generates a unique localStorage key for a given ID
 * @param {string} id - The unique identifier for the selections
 * @returns {string} The formatted localStorage key
 */
const getSelectionsStorageKey = id => {
  return `vass-selections-${id}`;
};

/**
 * Retrieves selections from localStorage for a given ID
 * @param {string} id - The unique identifier for the selections
 * @returns {Object} The selections object containing selectedTopics and selectedSlotTime
 */
const getSelections = id => {
  const savedSelections = localStorage.getItem(getSelectionsStorageKey(id));
  if (savedSelections) {
    try {
      return JSON.parse(savedSelections);
    } catch (error) {
      // clear the unparsable entry from localStorage
      localStorage.removeItem(getSelectionsStorageKey(id));
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
 * @param {string} id - A unique identifier for storing selections (e.g., UUID)
 * @returns {Object} An object containing methods to manage persistent selections
 * @returns {Function} returns.saveDateSelection - Saves the selected date/time slot
 * @returns {Function} returns.saveTopicsSelection - Saves the selected topics array
 * @returns {Function} returns.clearSelections - Clears all saved selections for the given ID
 * @returns {Function} returns.getSaved - Retrieves all saved selections for the given ID
 */
export const usePersistentSelections = id => {
  /**
   * Saves the selected date/time slot to localStorage
   * @param {string|Date} dateTime - The selected date/time value
   */
  const saveDateSelection = dateTime => {
    const selections = getSelections(id);
    const newSelections = { ...selections, selectedSlotTime: dateTime };
    localStorage.setItem(
      getSelectionsStorageKey(id),
      JSON.stringify(newSelections),
    );
  };

  /**
   * Saves the selected topics array to localStorage
   * @param {Array} topics - Array of selected topic identifiers
   */
  const saveTopicsSelection = topics => {
    const selections = getSelections(id);
    const newSelections = { ...selections, selectedTopics: topics };
    localStorage.setItem(
      getSelectionsStorageKey(id),
      JSON.stringify(newSelections),
    );
  };

  /**
   * Removes all saved selections from localStorage for the given ID
   */
  const clearSelections = () => {
    localStorage.removeItem(getSelectionsStorageKey(id));
  };

  /**
   * Retrieves all saved selections from localStorage
   * @returns {Object} Object containing selectedTopics and selectedSlotTime
   */
  const getSaved = () => {
    return getSelections(id);
  };

  return {
    saveDateSelection,
    saveTopicsSelection,
    clearSelections,
    getSaved,
  };
};
