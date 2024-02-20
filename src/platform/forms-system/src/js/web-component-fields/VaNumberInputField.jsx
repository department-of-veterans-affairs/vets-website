import React from 'react';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';

/** @param {WebComponentFieldProps} props */
export const vaNumberInputMapping = props => {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  let inputType = uiOptions?.inputType;
  if (!inputType) {
    inputType = ['number', 'integer'].includes(childrenProps.schema.type)
      ? 'number'
      : 'text';
  }

  const commonFieldProps = commonFieldMapping(props);
  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  return {
    ...commonFieldProps,
    ...formsPatternProps,
    autocomplete:
      childrenProps.uiSchema['ui:autocomplete'] || uiOptions?.autocomplete,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || textDescription || undefined,
    type: inputType,
    width: uiOptions?.width,
    min: uiOptions?.min,
    max: uiOptions?.max,
    currency: uiOptions?.currency,
    charcount: uiOptions?.charcount,
    onInput: (event, value) => {
      // redux value or input value
      let newVal = Number(value || event.target.value);
      // pattern validation will trigger if you have '',
      // so set as undefined instead.
      newVal = newVal === '' ? undefined : newVal;
      childrenProps.onChange(newVal);
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <>
        {formDescriptionSlot}
        {textDescription && <p>{textDescription}</p>}
        {uiOptions?.currency && <span id="symbol">$</span>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };
};

/**
 * Usage uiSchema:
 * ```
 * numberInput: {
 *   'ui:title': 'Text input',
 *   'ui:description': 'description',
 *   'ui:webComponentField': VaTextInputField,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     width: 'md',
 *     charcount: true,
 *     messageAriaDescribedby: 'text description to be read by screen reader',
 *     inert: true,
 *     enableAnalytics: true,
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * numberInput: {
 *   type: 'string',
 *   minLength: 1,
 *   maxLength: 24,
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaNumberInputField(props) {
  const mappedProps = vaNumberInputMapping(props);
  return <VaNumberInput {...mappedProps} />;
}
