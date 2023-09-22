import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

// START lighthouse_migration
import {
  getClaim as getClaimAction,
  getClaimDetail as getClaimEVSSAction,
} from '../actions';
import { cstUseLighthouse } from '../selectors';
// END lighthouse_migration

class ClaimPage extends React.Component {
  componentDidMount() {
    // START lighthouse_migration
    const {
      getClaimEVSS,
      getClaimLighthouse,
      params,
      router,
      useLighthouse,
    } = this.props;

    if (useLighthouse) {
      getClaimLighthouse(params.id, router);
    } else {
      getClaimEVSS(params.id, router);
    }
    // END lighthouse_migration
  }

  render() {
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    // START lighthouse_migration
    useLighthouse: cstUseLighthouse(state, 'show'),
    // END lighthouse_migration
  };
}

const mapDispatchToProps = {
  // START lighthouse_migration
  getClaimEVSS: getClaimEVSSAction,
  getClaimLighthouse: getClaimAction,
  // END lighthouse_migration
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ClaimPage),
);

ClaimPage.propTypes = {
  children: PropTypes.node,
  // START lighthouse_migration
  getClaimEVSS: PropTypes.func,
  getClaimLighthouse: PropTypes.func,
  // END lighthouse_migration
  params: PropTypes.object,
  router: PropTypes.object,
  // START lighthouse_migration
  useLighthouse: PropTypes.bool,
  // END lighthouse_migration
};

export { ClaimPage };
