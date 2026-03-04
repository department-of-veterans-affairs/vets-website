import React from 'react';
import PropTypes from 'prop-types';

import ViewDependentsLists from './ViewDependentsListsV2';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeaderV2';
import { errorFragment, noDependentsAlertV2 } from './helpers';

/**
 * @typedef ViewDependentsLayoutProps
 * @property {Boolean} error error status
 * @property {Boolean} hasMinimumRating true if disability rating is 30 or higher
 * @property {Boolean} loading loading state
 * @property {Boolean} manageDependentsToggle feature toggle
 * @property {Array} notOnAwardDependents list of inactive dependents
 * @property {Array} onAwardDependents list of active dependents
 */
/**
 * Renders view dependents page content
 * List of view dependent Layout
 * @param {ViewDependentsLayoutProps} props - Component props
 * @returns {JSX.Element} View dependents page layout
 */
function ViewDependentsLayout(props) {
  const {
    hasMinimumRating,
    loading,
    error,
    onAwardDependents,
    notOnAwardDependents,
  } = props;
  let mainContent;
  const hasError = !!error;
  // Only show the alert if there are on award dependents AND a rating of 30+
  const showDependentsContent = !loading && !hasError && hasMinimumRating;

  if (loading) {
    mainContent = (
      <va-loading-indicator message="Loading your information..." />
    );
  } else if (error) {
    mainContent = <va-alert status="error">{errorFragment}</va-alert>;
  } else if (
    onAwardDependents.length === 0 &&
    notOnAwardDependents.length === 0
  ) {
    mainContent = noDependentsAlertV2;
  } else {
    mainContent = (
      <ViewDependentsLists
        manageDependentsToggle={props.manageDependentsToggle}
        loading={loading}
        onAwardDependents={onAwardDependents}
        notOnAwardDependents={notOnAwardDependents}
      />
    );
  }

  const layout = (
    <>
      <ViewDependentsHeader
        updateDiariesStatus={props.updateDiariesStatus}
        hasAwardDependents={onAwardDependents.length > 0}
        hasMinimumRating={hasMinimumRating}
        showDependentsContent={showDependentsContent}
      />
      {mainContent}
    </>
  );

  return <div className="vads-u-margin-bottom--4">{layout}</div>;
}

ViewDependentsLayout.propTypes = {
  dependentsToggle: PropTypes.bool,
  error: PropTypes.object,
  hasMinimumRating: PropTypes.bool,
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.func,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsLayout;
