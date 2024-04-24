export const appendReportsFromLocalStorage = resultsArray => {
  const localReportsArray = localStorage.getItem('vaReports');

  if (localReportsArray) {
    const parsedLocalReportsArray = JSON.parse(localReportsArray);
    for (const localReport of parsedLocalReportsArray) {
      const resultMatch = resultsArray.find(
        resultItem => resultItem.id === localReport.representativeId,
      );

      if (resultMatch) {
        resultMatch.reports = localReport.reports;
      }
    }
  }

  return resultsArray;
};

/**
 * "Enum" of keyboard keys to their numerical equivalent
 */
export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40,
};
