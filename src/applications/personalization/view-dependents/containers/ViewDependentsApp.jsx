import React, { Component } from 'react';
import { connect } from 'react-redux';

import ViewDependentsLayout from '../layouts/ViewDependentsLayout';
import { fetchDependents } from '../actions/index';

class ViewDependentsApp extends Component {
  componentDidUpdate() {
    this.props.fetchDependents();
  }

  render() {
    return (
      <>
        <ViewDependentsLayout
          fetchDependents={this.props.fetchDependents}
          loading={this.props.loading}
          error={this.props.error}
          onAwardDependents={this.props.onAwardDependents}
          notOnAwardDependents={this.props.notOnAwardDependents}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading, // app starts in loading state
  error: state.error,
  onAwardDependents: state.onAwardDependents,
  notOnAwardDependents: state.notOnAwardDependents,
});

const mapDispatchToProps = {
  fetchDependents,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewDependentsApp);
export { ViewDependentsApp };
