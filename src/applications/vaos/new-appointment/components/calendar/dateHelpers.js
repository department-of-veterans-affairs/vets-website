export function isDateInSelectedArray(date, selectedArray) {
  return selectedArray?.filter(d => d.date === date)?.length > 0;
}

export function isDateOptionPairInSelectedArray(
  dateObj,
  selectedArray,
  option,
) {
  for (let index = 0; index < selectedArray.length; index++) {
    const currentDateObj = selectedArray[index];
    if (
      currentDateObj.date === dateObj.date &&
      currentDateObj[option] === dateObj[option]
    ) {
      return true;
    }
  }
  return false;
}

export function removeDateFromSelectedArray(date, selectedArray) {
  return selectedArray.filter(d => d.date !== date);
}
