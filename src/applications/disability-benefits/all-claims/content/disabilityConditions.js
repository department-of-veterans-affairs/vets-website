// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
export const capitalizeFirstLetter = string =>
  string?.charAt(0).toUpperCase() + string?.slice(1);

export const createNewConditionName = (item = {}, capFirstLetter = false) => {
  const newConditionName = item.condition;

  // Check for a non-empty string here instead of each time
  // arrayBuilderItemSubsequentPageTitleUI is called in different files
  const checkNewConditionName =
    typeof newConditionName === 'string' && newConditionName.trim()
      ? newConditionName.trim()
      : 'condition';

  const newCondition = capFirstLetter
    ? capitalizeFirstLetter(checkNewConditionName)
    : checkNewConditionName;

  if (item?.sideOfBody) {
    return `${newCondition}, ${item.sideOfBody.toLowerCase()}`;
  }

  return newCondition;
};
