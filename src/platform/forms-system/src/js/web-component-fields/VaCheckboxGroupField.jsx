/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import commonFieldMapping from './commonFieldMapping';
import formsPatternFieldMapping from './formsPatternFieldMapping';

// Combines schema, uiSchema, and formData together
// for each checkbox for easier access
const getCheckboxData = ({ schema, uiSchema, formData }) => {
  return Object.keys(schema.properties).map(key => ({
    key,
    schema: schema.properties[key],
    uiSchema: uiSchema[key],
    formData: formData[key],
  }));
};
/**
 * Usage uiSchema:
 * ```
 * checkboxGroup: {
 *   'ui:title': 'This is a checkbox',
 *   'ui:description': 'This is a checkbox with a description',
 *   'ui:webComponentField': VaCheckboxGroupField,
 *   'ui:errorMessages': {
 *     required: 'Checkbox required error',
 *   },
 *   hasA: {
 *      'ui:title': 'Option A',
 *   },
 *   hasB: {
 *     'ui:title': 'Option B',
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * checkboxGroup: {
 *   type: 'object',
 *   properties: {
 *     hasA: { type: 'boolean' },
 *     hasB: { type: 'boolean' },
 *   }
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaCheckboxGroupField(props) {
  const checkboxes = getCheckboxData(props.childrenProps);

  const onGroupChange = event => {
    const checkboxKey = event.target.dataset.key;
    const isChecked = event.detail.checked;

    const newVal = {
      ...props.childrenProps.formData,
      [checkboxKey]: isChecked,
    };

    props.childrenProps.onChange(newVal);
  };

  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  return (
    <VaCheckboxGroup
      {...commonFieldMapping(props)}
      {...formsPatternProps}
      label={props.label}
      labelHeaderLevel={props.uiOptions?.labelHeaderLevel}
      onVaChange={onGroupChange}
      // onBlur={} // it seems this is not necessary.
      // prefer to show error on trying to continue instead.
    >
      <>
        <>
          {formDescriptionSlot}
          {/* known a11y issue: this will not be read out */}
          {props.textDescription && <p>{props.textDescription}</p>}
          {props.DescriptionField && (
            <props.DescriptionField
              options={props.uiOptions}
              index={props.index}
            />
          )}
          {!props.textDescription &&
            !props.DescriptionField &&
            props.description}
        </>
        {checkboxes?.length > 0 &&
          // eslint-disable-next-line no-unused-vars
          checkboxes.map(({ key, uiSchema, schema, formData }) => {
            return (
              <va-checkbox
                data-key={key}
                name={`${props.childrenProps.idSchema.$id}_${key}`}
                key={key}
                uswds={props.uiOptions?.uswds ?? true}
                label={uiSchema['ui:title']}
                checked={formData === 'undefined' ? false : formData}
                tile={props.uiOptions?.tile}
                checkbox-description={uiSchema['ui:description']}
              />
            );
          })}
      </>
    </VaCheckboxGroup>
  );
}

VaCheckboxGroupField.propTypes = {
  DescriptionField: PropTypes.any,
  childrenProps: PropTypes.oneOfType([
    PropTypes.shape({
      formData: PropTypes.any,
      schema: PropTypes.object,
      uiSchema: PropTypes.object,
    }),
    PropTypes.object,
  ]),
  description: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.string,
  ]),
  error: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  required: PropTypes.bool,
  textDescription: PropTypes.string,
  uiOptions: PropTypes.object,
};
