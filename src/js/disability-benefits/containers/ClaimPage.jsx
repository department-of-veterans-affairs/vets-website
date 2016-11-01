import React from 'react';
import { connect } from 'react-redux';

import { getClaimDetail } from '../actions';

class ClaimPage extends React.Component {
  componentDidMount() {
    this.props.getClaimDetail(this.props.params.id);
    document.title = 'Your Compensation Claim';
  }
  render() {
    return this.props.children;
  }
}

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = {
  getClaimDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimPage);

