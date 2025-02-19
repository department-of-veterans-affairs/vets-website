import { useCombobox } from 'downshift-v9';

export const srKeepOnBlur = (state, actionAndChanges) => {
  const { changes, type } = actionAndChanges;

  switch (type) {
    case useCombobox.stateChangeTypes.InputBlur:
      return { ...changes, inputValue: state.inputValue };
    case useCombobox.stateChangeTypes.InputKeyDownEscape:
      return { isOpen: false, inputValue: state.inputValue };
    default:
      return changes;
  }
};

export const srClearOnBlur = (state, actionAndChanges) => {
  const { type, changes } = actionAndChanges;
  if (type === useCombobox.stateChangeTypes.InputBlur) {
    return {
      ...changes,
      inputValue: '',
    };
  }
  return changes;
};
