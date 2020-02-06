import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllDependents } from '../actions/index';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';

class ViewDependentsApp extends Component {
  componentDidMount() {
    this.props.fetchAllDependents();
  }

  render() {
    return (
      <RequiredLoginView
        authRequired={1}
        serviceRequired={backendServices.USER_PROFILE}
        user={this.props.user}
        loginUrl={this.props.loginUrl}
        verifyUrl={this.props.verifyUrl}
      >
        <ViewDependentsLayout
          loading={this.props.loading}
          error={this.props.error}
          onAwardDependents={this.props.onAwardDependents}
          notOnAwardDependents={this.props.notOnAwardDependents}
        />
      </RequiredLoginView>
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
