import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';
import ViewDependentsLists from './ViewDependentsListsV2';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeaderV2';
import { isServerError, isClientError } from '../util';
import { errorFragment, noDependentsAlertV2 } from './helpers';

/**
 * Builds view dependents page '/dependents/view'
 * @param {Object} props all props
 * @param {Boolean} props.loading loading state
 * @param {Boolean} props.error error status
 * @param {Array} props.onAwardDependents list of active dependents
 * @param {Array} props.notOAwardDependents list of inactive dependents
 * @param {Boolean} props.manageDependentsToggle feature toggle
 * @param {Boolean} props.hasMinimumRating true if disability rating is 30 or higher
 * @returns {components} <ViewDependentsLists>, <ViewDependentsHeader>
 */
function ViewDependentsLayout(props) {
  let mainContent;
  let hasDependents = false;

  if (props.loading) {
    mainContent = (
      <va-loading-indicator message="Loading your information..." />
    );
  } else if (props.error && isServerError(props.error.code)) {
    mainContent = <va-alert status="error">{errorFragment}</va-alert>;
  } else if (
    (props.error && isClientError(props.error.code)) ||
    (props.onAwardDependents == null && props.notOnAwardDependents == null)
  ) {
    mainContent = noDependentsAlertV2;
  } else {
    // Only show the alert if there are on award dependents AND a rating of 30+
    hasDependents =
      props.onAwardDependents?.length > 0 && props.hasMinimumRating;
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
    !hasDependents &&
    (props.notOnAwardDependents === null ||
      props.notOnAwardDependents?.length === 0);
  const layout = (
    <>
      <ViewDependentsHeader
        updateDiariesStatus={props.updateDiariesStatus}
        showAlert={hasDependents}
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
