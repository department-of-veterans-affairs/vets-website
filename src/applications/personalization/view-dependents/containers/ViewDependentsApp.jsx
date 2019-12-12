import React, { Component } from 'react';
import { getData } from '../util/index';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';

class ViewDependentsApp extends Component {
  state = {
    loading: true, // app starts in loading state
    error: null,
    onAwardDependents: null,
    notOnAwardDependents: null,
  };

  componentDidMount() {
    this.makeAPICall();
  }

  async makeAPICall() {
    const response = await getData(
      '/disability_compensation_form/rated_disabilities',
    );

    if (response.errors) {
      // this will be changed to pass the error to the state and the child components when mockup is provided for error states
      this.setState({
        loading: false,
        onAwardDependents: [
          {
            name: 'Billy Blank',
            social: '312-243-5634',
            onAward: true,
            birthdate: '05-05-1983',
          },
          {
            name: 'Cindy See',
            social: '312-243-5634',
            onAward: true,
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
    } else {
      this.setState({
        loading: false,
        onAwardDependents: [
          {
            name: 'Billy Blank',
            social: '312-243-5634',
            onAward: true,
            birthdate: '05-05-1983',
          },
          {
            name: 'Cindy See',
            social: '312-243-5634',
            onAward: true,
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
      <ViewDependentsLayout
        loading={this.state.loading}
        error={this.state.error}
        onAwardDependents={this.state.onAwardDependents}
        notOnAwardDependents={this.state.notOnAwardDependents}
      />
    );
  }
}

export default ViewDependentsApp;
