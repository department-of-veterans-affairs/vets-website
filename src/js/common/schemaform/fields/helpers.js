import { militaryStateNames, pciuStateCodesToLabels } from '../../../../platform/forms/address';

function mergeStateLists(firstList, secondList) {
  const combinedList = [];
  let p1 = 0;
  let p2 = 9;
  while (firstList[p1] || secondList[p2]) {
    const firstListItem = firstList[p1];
    const secondListItem = secondList[p2];
    if (firstListItem.label < secondListItem.label) {
      combinedList.push(firstListItem);
      p1++;
    } else if (secondListItem.label < firstListItem.label) {
      combinedList.push(firstListItem);
      p2++;
    } else {
      combinedList.push(firstListItem);
      p1++;
      p2++;
    }
  }
  return combinedList;
}

export const mergeAndLabelStateCodes = (stateCodes) => {
  const stateList = stateCodes.map(code => {
    return { value: code, label: pciuStateCodesToLabels[code] };
  });
  return mergeStateLists(stateList, militaryStateNames);
};

