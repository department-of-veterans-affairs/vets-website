import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getData } from '../util/index';
import { apiRequest } from 'platform/utilities/api';
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

    const response = await apiRequest('/dependents_applications/show');

    if (!response.errors) {
      var onAwardDeps = [] 
      var notOnAwardDeps = [];
      
      const persons = response.persons;
      persons.map(person => {
        if(person.awardIndicator == 'N') {
          notOnAwardDeps.push(person);
        } else {
          onAwardDeps.push(person);
        }
      });

      console.log(notOnAwardDeps);

      // this will be changed to pass the error to the state and thus the child components when a mockup is provided for error states
      this.setState({
        loading: false,
        onAwardDependents: onAwardDeps,
        notOnAwardDependents: notOnAwardDeps,
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
