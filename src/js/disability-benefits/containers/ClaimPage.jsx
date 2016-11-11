import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getClaimDetail } from '../actions';

class ClaimPage extends React.Component {
  componentDidMount() {
    this.props.getClaimDetail(this.props.params.id)
      .catch(resp => {
        if (!resp.ok && resp.status === 404) {
          this.props.router.replace('your-claims');
        }
      });
    document.title = 'Your Disability Compensation Claim';
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClaimPage));

