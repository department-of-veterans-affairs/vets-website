import React from 'react';
import PropTypes from 'prop-types';

import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaRadioFieldMapping from './vaRadioFieldMapping';

function optionsList(schema) {
  return schema.enum.map((value, i) => {
    const label = (schema.enumNames && schema.enumNames[i]) || String(value);
    return { label, value };
  });
}

/**
 * Use radio pattern instead.
 *
 * Usage uiSchema:
 * ```js
 * exampleRadio: radioUI({
 *  title: 'Select animal',
 *  labels: {
 *      dog: 'Dog',
 *      cat: 'Cat',
 *      octopus: 'Octopus',
 *  }
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleRadio: radioSchema(['cat', 'dog', 'octopus'])
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaRadioField(props) {
  const mappedProps = vaRadioFieldMapping(props);
  const labels = props.uiOptions?.labels || {};
  const { schema } = props.childrenProps;
  // For non-required options, schema enum should be left undefined
  const enumOptions =
    (Array.isArray(schema.enum) && schema.enum.length && optionsList(schema)) ||
    Object.entries(labels).map(([value, label]) => ({ label, value }));
  const descriptions = props.uiOptions.descriptions || {};

  const selectedValue = props.childrenProps.formData ?? schema.default ?? null;
  return (
    <VaRadio
      {...mappedProps}
      onVaValueChange={event => {
        const newVal = event.detail.value ?? undefined;
        props.childrenProps.onChange(newVal);
      }}
    >
      {mappedProps?.children}
      {enumOptions.map((option, index) => {
        return (
          <va-radio-option
            name={props.childrenProps.idSchema.$id}
            key={index}
            value={option.value}
            checked={selectedValue === option.value}
            label={labels[option.value] || option.label}
            description={descriptions[option.value]}
            uswds={mappedProps?.uswds}
            tile={props.uiOptions?.tile}
          />
        );
      })}
    </VaRadio>
  );
}

VaRadioField.propTypes = {
  childrenProps: PropTypes.shape({
    formData: PropTypes.shape({}),
    idSchema: PropTypes.shape({
      $id: PropTypes.string,
    }),
    onChange: PropTypes.func,
    schema: PropTypes.shape({
      default: PropTypes.any,
      enum: PropTypes.array,
    }),
    uiSchema: PropTypes.shape({}),
  }),
  uiOptions: PropTypes.shape({
    descriptions: PropTypes.shape({}),
    labels: PropTypes.shape({}),
    tile: PropTypes.bool,
  }),
};
