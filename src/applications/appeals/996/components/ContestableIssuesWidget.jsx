import React from 'react';
import PropTypes from 'prop-types';

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

ContestableIssuesWidget.propTypes = {
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  formData: PropTypes.shape({
    contestedIssues: PropTypes.array,
    additionalIssues: PropTypes.array,
  }),
  id: PropTypes.string,
  options: PropTypes.shape({}),
  value: PropTypes.array, // not used
  onChange: PropTypes.func, // not used
};

export default ContestableIssuesWidget;
