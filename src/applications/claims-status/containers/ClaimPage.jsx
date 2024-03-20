import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { getClaim as getClaimAction } from '../actions';

class ClaimPage extends React.Component {
  componentDidMount() {
    const { getClaim, params, router } = this.props;

    getClaim(params.id, router);
  }

  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = {
  getClaim: getClaimAction,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(ClaimPage),
);

ClaimPage.propTypes = {
  children: PropTypes.node,
  getClaim: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
};

export { ClaimPage };
