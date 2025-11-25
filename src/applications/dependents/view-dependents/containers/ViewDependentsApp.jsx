import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import backendServices from 'platform/user/profile/constants/backendServices';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import titleCase from 'platform/utilities/data/titleCase';

import { fetchAllDependents as fetchAllDependentsAction } from '../actions/index';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';
import ViewDependentsLayoutV2 from '../layouts/ViewDependentsLayoutV2';

import { PAGE_TITLE, TITLE_SUFFIX } from '../util';

const ViewDependentsApp = ({
  user,
  loading,
  error,
  onAwardDependents,
  notOnAwardDependents,
  manageDependentsToggle,
  dependentsVerificationFormToggle,
  updateDiariesStatus,
  fetchAllDependents,
}) => {
  useEffect(
    () => {
      fetchAllDependents();
      document.title = `${titleCase(PAGE_TITLE)}${TITLE_SUFFIX}`;
    },
    [fetchAllDependents],
  );

  const layout = dependentsVerificationFormToggle ? (
    <ViewDependentsLayoutV2
      loading={loading}
      error={error}
      onAwardDependents={onAwardDependents}
      notOnAwardDependents={notOnAwardDependents}
      manageDependentsToggle={manageDependentsToggle}
      updateDiariesStatus={updateDiariesStatus}
    />
  ) : (
    <ViewDependentsLayout
      loading={loading}
      error={error}
      onAwardDependents={onAwardDependents}
      notOnAwardDependents={notOnAwardDependents}
      manageDependentsToggle={manageDependentsToggle}
      updateDiariesStatus={updateDiariesStatus}
    />
  );
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns print-full-width">
        <DowntimeNotification
          appTitle="view dependents tool"
          dependencies={[
            externalServices.bgs,
            externalServices.global,
            externalServices.mvi,
            externalServices.vaProfile,
            externalServices.vbms,
          ]}
        >
          <RequiredLoginView
            serviceRequired={backendServices.USER_PROFILE}
            user={user}
          >
            {layout}
          </RequiredLoginView>
        </DowntimeNotification>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  loading: state.allDependents.loading,
  error: state.allDependents.error,
  manageDependentsToggle: toggleValues(state)[
    FEATURE_FLAG_NAMES.manageDependents
  ],
  dependentsVerificationFormToggle: toggleValues(state)[
    FEATURE_FLAG_NAMES.vaDependentsVerification
  ],
  onAwardDependents: state.allDependents.onAwardDependents,
  notOnAwardDependents: state.allDependents.notOnAwardDependents,
  updateDiariesStatus: state.verifyDependents.updateDiariesStatus,
});

const mapDispatchToProps = {
  fetchAllDependents: fetchAllDependentsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewDependentsApp);

ViewDependentsApp.propTypes = {
  fetchAllDependents: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  dependentsVerificationFormToggle: PropTypes.bool,
  error: PropTypes.object,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.bool,
  onAwardDependents: PropTypes.array,
};

export { ViewDependentsApp };
