const initialSelections = {
  selectedTopics: [],
  selectedSlotTime: null,
};

const getSelectionsStorageKey = id => {
  return `vass-selections-${id}`;
};

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

export const usePersistentSelections = id => {
  const saveDateSelection = dateTime => {
    const selections = getSelections(id);
    const newSelections = { ...selections, selectedSlotTime: dateTime };
    localStorage.setItem(
      getSelectionsStorageKey(id),
      JSON.stringify(newSelections),
    );
  };

  const saveTopicsSelection = topics => {
    const selections = getSelections(id);
    const newSelections = { ...selections, selectedTopics: topics };
    localStorage.setItem(
      getSelectionsStorageKey(id),
      JSON.stringify(newSelections),
    );
  };

  const clearSelections = () => {
    localStorage.removeItem(getSelectionsStorageKey(id));
  };

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
