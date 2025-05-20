import React, { Component } from 'react';
import { connect } from 'react-redux';
import backendServices from 'platform/user/profile/constants/backendServices';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import titleCase from 'platform/utilities/data/titleCase';

import { fetchAllDependents } from '../actions/index';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';
import { PAGE_TITLE, TITLE_SUFFIX } from '../util';

class ViewDependentsApp extends Component {
  componentDidMount() {
    this.props.fetchAllDependents();
    document.title = `${titleCase(PAGE_TITLE)}${TITLE_SUFFIX}`;
  }

  render() {
    return (
      <div className="vads-l-grid-container vads-u-padding--2">
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
            user={this.props.user}
          >
            <ViewDependentsLayout
              loading={this.props.loading}
              error={this.props.error}
              onAwardDependents={this.props.onAwardDependents}
              notOnAwardDependents={this.props.notOnAwardDependents}
              manageDependentsToggle={this.props.manageDependentsToggle}
              dependencyVerificationToggle={
                this.props.dependencyVerificationToggle
              }
              updateDiariesStatus={this.props.updateDiariesStatus}
            />
          </RequiredLoginView>
        </DowntimeNotification>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.allDependents.loading,
  error: state.allDependents.error,
  manageDependentsToggle: toggleValues(state)[
    FEATURE_FLAG_NAMES.manageDependents
  ],
  dependencyVerificationToggle: toggleValues(state)[
    FEATURE_FLAG_NAMES.dependencyVerification
  ],
  onAwardDependents: state.allDependents.onAwardDependents,
  notOnAwardDependents: state.allDependents.notOnAwardDependents,
  updateDiariesStatus: state.verifyDependents.updateDiariesStatus,
});

const mapDispatchToProps = {
  fetchAllDependents,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewDependentsApp);
export { ViewDependentsApp };
