import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';

import { getContestableIssues as getContestableIssuesAction } from '../actions';
import { APP_NAME } from '../constants';
import { getEligibleContestableIssues } from '../../shared/utils/issues';

import { FETCH_CONTESTABLE_ISSUES_FAILED } from '../../shared/actions';
import ContestableIssues from '../../shared/components/ContestableIssues';

/**
 * ContestableIssuesWidget - Form system parameters passed into this widget
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
 * @param {Object[]} value - array value (contested issues only)
 * @param {Object} contestableIssues - API status & loaded issues
 * @param {func} getContestableIssues - API action
 * @param {Object} formData - full form data
 * @param {Object} uiSchema - ui schema
 * @param {Object[]} value - array value (when used as widget)
 * @return {JSX}
 */
const ContestableIssuesWidget = props => {
  const {
    getContestableIssues,
    contestableIssues,
    onChange,
    schema,
    setFormData,
    formData = {},
    value,
    uiSchema,
    ...restProps
  } = props;
  const hasAttempted = useRef(false);

  useEffect(
    () => {
      if (
        !hasAttempted.current &&
        contestableIssues.status === FETCH_CONTESTABLE_ISSUES_FAILED
      ) {
        hasAttempted.current = true; // only call API once if previously failed
        getContestableIssues();
      }
    },
    [contestableIssues.status, getContestableIssues],
  );

  useEffect(() => {
    // contestedIssues becomes undefined after a new save-in-progress loads
    // (prefill) and removes formData.contestedIssues added by FormApp
    // Eventually, we'll move all the API-loading & updating code on to the
    // contestable issues page and remove it all from FormApp
    if (formData?.contestedIssues === undefined) {
      setFormData({
        ...formData,
        contestedIssues: getEligibleContestableIssues(
          contestableIssues?.issues,
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  contestableIssues: PropTypes.shape({
    issues: PropTypes.array,
    status: PropTypes.string,
  }),
  formData: PropTypes.shape({
    contestedIssues: PropTypes.array,
  }),
  getContestableIssues: PropTypes.func,
  name: PropTypes.string,
  options: PropTypes.object,
  schema: PropTypes.object,
  setFormData: PropTypes.func,
  uiSchema: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  contestableIssues: state?.contestableIssues,
});
const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export { ContestableIssuesWidget };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContestableIssuesWidget);
