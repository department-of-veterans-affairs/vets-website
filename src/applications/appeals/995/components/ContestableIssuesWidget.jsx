import React from 'react';
import PropTypes from 'prop-types';
import { APP_NAME } from '../constants';
import ContestableIssues from '../../shared/components/ContestableIssues';

/**
 * ContestableIssuesWidget - Form system parameters passed into this widget
 * Can be used as either a widget or a field component
 * @param {Boolean} autofocus - should auto focus
 * @param {Boolean} disabled -  is disabled?
 * @param {Object} formContext -  state
 * @param {Object} formData - form data (when used as field)
 * @param {String} id - ID base for form elements
 * @param {String} label - label text
 * @param {func} onBlur - blur callback
 * @param {func} onChange - on change callback
 * @param {Object} options - ui:options
 * @param {String} placeholder - placeholder text
 * @param {Boolean} readonly - readonly state
 * @param {Object} registry - contains definitions, fields, widgets & templates
 * @param {Boolean} required - Show required flag
 * @param {Object} schema - array schema
 * @param {Object} uiSchema - ui schema
 * @param {Object[]} value - array value (when used as widget)
 * @return {JSX}
 */
const ContestableIssuesWidget = props => {
  const { schema, uiSchema, formData, onChange, value, ...restProps } = props;

  return (
    <ContestableIssues
      {...restProps}
      id={`root_${props.name}`}
      schema={schema}
      options={uiSchema?.['ui:options'] || props.options}
      value={formData || value}
      onChange={onChange}
      appName={APP_NAME}
    />
  );
};

ContestableIssuesWidget.propTypes = {
  formData: PropTypes.array,
  name: PropTypes.string,
  options: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default ContestableIssuesWidget;
