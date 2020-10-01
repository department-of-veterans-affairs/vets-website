import React, { Component } from 'react';
import { connect } from 'react-redux';
import backendServices from 'platform/user/profile/constants/backendServices';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { fetchAllDependents } from '../actions/index';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';

class ViewDependentsApp extends Component {
  componentDidMount() {
    this.props.fetchAllDependents();
  }

  render() {
    return (
      <div className="vads-l-grid-container vads-u-padding--2">
        <DowntimeNotification
          appTitle="view dependents tool"
          dependencies={[externalServices.bgs]}
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
  onAwardDependents: state.allDependents.onAwardDependents,
  notOnAwardDependents: state.allDependents.notOnAwardDependents,
});

const mapDispatchToProps = {
  fetchAllDependents,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewDependentsApp);
export { ViewDependentsApp };
