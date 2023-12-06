import React from 'react';

import { APP_NAME } from '../constants';

import ContestableIssues from '../../shared/components/ContestableIssues';

/**
 * ContestableIssuesWidget - Form system parameters passed into this widget
 * @param {Boolean} autofocus - should auto focus
 * @param {Boolean} disabled -  is disabled?
 * @param {Object} formContext -  state
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
 * @param {Object[]} value - array value
 * @return {JSX}
 */
const ContestableIssuesWidget = props => (
  <ContestableIssues {...props} appName={APP_NAME} />
);

export default ContestableIssuesWidget;
