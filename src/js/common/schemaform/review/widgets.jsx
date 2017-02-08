import React from 'react';
import { formatReviewDate } from '../helpers';

export function TextWidget({ value }) {
  return <span>{value}</span>;
}

export function DateWidget({ value }) {
  return <span>{formatReviewDate(value)}</span>;
}

export const EmailWidget = TextWidget;
export const TextareaWidget = TextWidget;

export function SelectWidget({ options, value }) {
  const selected = options.enumOptions.filter(opt => opt.value === value);
  if (selected.length) {
    return <span>{selected[0].label}</span>;
  }

  return null;
}

export const RadioWidget = SelectWidget;

export const yesNo = ({ value }) => {
  let displayValue;
  if (value === true) {
    displayValue = 'Yes';
  } else if (value === false) {
    displayValue = 'No';
  }

  return <span>{displayValue}</span>;
};

export const CheckboxWidget = ({ value }) => {
  return <span>{value === true ? 'True' : 'False'}</span>;
};
