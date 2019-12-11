import React, { Component } from 'react';
import { connect } from 'react-redux';

import ViewDependentsLayout from '../layouts/ViewDependentsLayout';
import { fetchDependents } from '../actions/index';

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

  makeAPICall = () => {
    this.setState({
      loading: false,
      onAwardDependents: [
        {
          name: "gidget",
          social: "312-243-5634",
          onAward: true,
        }
      ],
      notOnAwardDependents: [
        
      ],
    });
  }

  render() {
    return (
      <>
        <ViewDependentsLayout
          loading={this.state.loading}
          error={this.state.error}
          onAwardDependents={this.state.onAwardDependents}
          notOnAwardDependents={this.state.notOnAwardDependents}
        />
      </>
    );
  }
}

export default ViewDependentsApp;
