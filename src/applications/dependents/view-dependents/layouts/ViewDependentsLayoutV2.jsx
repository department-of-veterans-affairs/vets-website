import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';
import ViewDependentsLists from './ViewDependentsListsV2';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeaderV2';
import { isServerError, isClientError } from '../util';
import { errorFragment, noDependentsAlertV2 } from './helpers';

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
    // Don't show the alert if there are no on award dependents
    hasDependents = props.onAwardDependents?.length > 0;
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
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.func,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsLayout;
