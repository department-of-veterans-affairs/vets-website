import React from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaRadioFieldMapping from './vaRadioFieldMapping';
import { schemaToEnumOptions } from './helpers';

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
  const enumOptions = Array.isArray(props.childrenProps.schema.enum)
    ? schemaToEnumOptions(props.childrenProps.schema)
    : [];
  const labels = props.uiOptions?.labels || {};
  const descriptions = props.uiOptions?.descriptions || {};

  const selectedValue =
    props.childrenProps.formData ?? props.childrenProps.schema.default ?? null;

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
    schema: PropTypes.shape({
      enum: PropTypes.array,
      default: PropTypes.any,
    }),
    formData: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    idSchema: PropTypes.shape({
      $id: PropTypes.string,
    }),
  }).isRequired,
  uiOptions: PropTypes.shape({
    labels: PropTypes.object,
    descriptions: PropTypes.object,
    tile: PropTypes.bool,
  }),
};
