import { fireEvent } from '@testing-library/react';

export const changeCheckboxInGroup = async (
  checkboxGroup,
  targetLabel,
  targetKey,
  value,
) =>
  checkboxGroup.__events.vaChange({
    target: { checked: value, label: targetLabel, dataset: { key: targetKey } },
    detail: { checked: value },
  });

export const changeCheckbox = async (checkbox, value) => {
  await checkbox.__events.vaChange({
    detail: { checked: value },
  });
};

export const fillTextInput = (container, name, value) => {
  const input = container.querySelector(`va-text-input[name="${name}"]`);
  input.value = value;
  return fireEvent.input(input, { target: { name } });
};

export const fillDateInput = async (container, name, value) => {
  const dateInput = container.querySelector(
    `va-memorable-date[name="${name}"]`,
    container,
  );
  const dateEvent = { target: { value } };
  dateInput.__events.dateChange(dateEvent);
  return dateInput.__events.dateBlur(dateEvent);
};

export const fillRadio = async (radio, value) => {
  await radio.__events.vaValueChange({
    detail: { value },
  });
};
