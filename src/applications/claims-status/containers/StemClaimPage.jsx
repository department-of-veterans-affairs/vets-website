import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getStemClaims } from '../actions/index.jsx';

class StemClaimPage extends React.Component {
  componentDidMount() {
    this.props.getStemClaims();
  }
  render() {
    return this.props.children;
  }
}

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = {
  getStemClaims,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StemClaimPage),
);
