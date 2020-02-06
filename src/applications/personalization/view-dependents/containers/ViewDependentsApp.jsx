import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getData } from '../util/index';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';

class ViewDependentsApp extends Component {
  state = {
    loading: true, // app starts in loading state
    error: null,
    onAwardDependents: null,
    notOnAwardDependents: null,
  };

  componentDidMount() {
    this.fetchAllDependents();
  }

  async fetchAllDependents() {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response) {
      // this will be changed to pass the error to the state and thus the child components when a mockup is provided for error states
      this.setState({
        loading: false,
        onAwardDependents: [
          {
            name: 'Billy Blank',
            social: '312-243-5634',
            birthdate: '05-05-1983',
          },
          {
            name: 'Cindy See',
            social: '312-243-5634',
            birthdate: '05-05-1953',
            spouse: true,
          },
        ],
        notOnAwardDependents: [
          {
            name: 'Frank Fuzzy',
            social: '312-243-5634',
            birthdate: '05-05-1953',
          },
        ],
      });
    }
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
          loading={this.state.loading}
          error={this.state.error}
          onAwardDependents={this.state.onAwardDependents}
          notOnAwardDependents={this.state.notOnAwardDependents}
        />
      </RequiredLoginView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(ViewDependentsApp);
export { ViewDependentsApp };
