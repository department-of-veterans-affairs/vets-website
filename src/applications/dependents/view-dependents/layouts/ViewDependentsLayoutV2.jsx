import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';
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
  let mainContent;
  let hasDependents = false;

  if (props.loading) {
    mainContent = (
      <va-loading-indicator message="Loading your information..." />
    );
  } else if (props.error) {
    mainContent = <va-alert status="error">{errorFragment}</va-alert>;
  } else if (
    props.onAwardDependents.length === 0 &&
    props.notOnAwardDependents.length === 0
  ) {
    mainContent = noDependentsAlertV2;
  } else {
    // Only show the alert if there are on award dependents AND a rating of 30+
    hasDependents =
      props.onAwardDependents.length > 0 && props.hasMinimumRating;
    mainContent = (
      <ViewDependentsLists
        manageDependentsToggle={props.manageDependentsToggle}
        loading={props.loading}
        hasDependents={hasDependents}
        onAwardDependents={props.onAwardDependents}
        notOnAwardDependents={props.notOnAwardDependents}
      />
    );
  }

  const showActionLink =
    !hasDependents && props.notOnAwardDependents.length === 0;
  const layout = (
    <>
      <ViewDependentsHeader
        updateDiariesStatus={props.updateDiariesStatus}
        showAlert={hasDependents}
        hasAwardDependents={props.onAwardDependents.length > 0}
        hasMinimumRating={props.hasMinimumRating}
      />
      {mainContent}
      {showActionLink && (
        <p>
          <va-link-action
            href={getAppUrl('686C-674-v2')}
            text="Add or remove a dependent"
            type="primary"
          />
        </p>
      )}
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
