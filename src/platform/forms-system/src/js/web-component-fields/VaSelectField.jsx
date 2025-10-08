import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaSelectFieldMapping from './vaSelectAndComboBoxFieldMapping';
import { renderOptions } from './helpers';

/**
 * Usage uiSchema:
 * ```
 * select: {
 *   'ui:title': 'Select field',
 *   'ui:webComponentField': VaSelectField,
 *   'ui:description': 'description',
 *   'ui:options': {
 *     labels: {
 *       option1: 'Option 1',
 *       option2: 'Option 2',
 *     },
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * select: {
 *   type: 'string',
 *   enum: ['option1', 'option2'],
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaSelectField(props) {
  let addDefaultEntry = false;
  const mappedProps = vaSelectFieldMapping(props);
  const labels = props.uiOptions?.labels || {};

  if (!mappedProps?.uswds) {
    // uswds=true adds a -Select- option by default
    // uswds=false only shows the options so we should add a default option
    addDefaultEntry = true;
  }

  return (
    <VaSelect
      {...mappedProps}
      value={
        props.childrenProps.formData ??
        props.childrenProps.schema.default ??
        undefined
      }
    >
      {addDefaultEntry &&
        !props.childrenProps.schema.default && <option value="" />}
      {renderOptions(props.childrenProps.schema, labels)}
    </VaSelect>
  );
}

VaSelectField.propTypes = {
  DescriptionField: PropTypes.func,
  childrenProps: PropTypes.object,
  description: PropTypes.string,
  error: PropTypes.string,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  required: PropTypes.bool,
  textDescription: PropTypes.string,
  uiOptions: PropTypes.object,
};
