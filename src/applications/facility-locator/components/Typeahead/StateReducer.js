import { useCombobox } from 'downshift-v9';

export function srKeepOnBlur(state, actionAndChanges) {
  const { changes } = actionAndChanges;
  return changes;
}

export function srClearOnBlur(state, actionAndChanges) {
  const { type, changes } = actionAndChanges;
  if (type === useCombobox.stateChangeTypes.InputBlur) {
    return {
      ...changes,
      inputValue: '',
    };
  }
  return changes;
}
