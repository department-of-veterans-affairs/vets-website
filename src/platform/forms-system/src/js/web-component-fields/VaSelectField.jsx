import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaSelectFieldMapping from './vaSelectFieldMapping';

function optionsList(schema) {
  return schema.enum.map((value, i) => {
    const label = (schema.enumNames && schema.enumNames[i]) || String(value);
    return { label, value };
  });
}

export default function VaSelectField(props) {
  const mappedProps = vaSelectFieldMapping(props);
  const enumOptions =
    Array.isArray(props.childrenProps.schema.enum) &&
    optionsList(props.childrenProps.schema);
  const labels = props.uiOptions?.labels || {};

  return (
    <VaSelect
      {...mappedProps}
      value={props.childrenProps.schema.default || null}
    >
      {/* {!props.childrenProps.schema.default && <option value="" />} */}
      {enumOptions.map((option, index) => {
        return (
          <option key={index} value={option.value}>
            {labels[option.value] || option.label}
          </option>
        );
      })}
    </VaSelect>
  );
}

VaSelectField.propTypes = {
  DescriptionField: PropTypes.func,
  childrenProps: PropTypes.object,
  description: PropTypes.string,
  error: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  required: PropTypes.bool,
  textDescription: PropTypes.string,
  uiOptions: {},
};
