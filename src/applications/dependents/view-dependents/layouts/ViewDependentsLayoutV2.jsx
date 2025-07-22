import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';
import ViewDependentsLists from './ViewDependentsListsV2';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeaderV2';
import { isServerError, isClientError } from '../util';
import { errorFragment, infoFragmentV2 } from './helpers';

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
    mainContent = (
      <va-alert status="info" slim>
        {infoFragmentV2}
      </va-alert>
    );
  } else {
    mainContent = (
      <ViewDependentsLists
        manageDependentsToggle={props.manageDependentsToggle}
        loading={props.loading}
        onAwardDependents={props.onAwardDependents}
        notOnAwardDependents={props.notOnAwardDependents}
        dependencyVerificationToggle={props.dependencyVerificationToggle}
      />
    );
    hasDependents = true;
  }

  const layout = (
    <>
      <ViewDependentsHeader
        updateDiariesStatus={props.updateDiariesStatus}
        showAlert={hasDependents}
      />
      {mainContent}
      {!hasDependents && (
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

  return <div>{layout}</div>;
}

ViewDependentsLayout.propTypes = {
  dependencyVerificationToggle: PropTypes.bool,
  dependentsToggle: PropTypes.bool,
  error: PropTypes.object,
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.func,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsLayout;
