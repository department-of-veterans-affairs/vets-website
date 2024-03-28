import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { getClaim as getClaimAction } from '../actions';

export function ClaimPage({ children, getClaim, params, router }) {
  useEffect(() => {
    getClaim(params.id, router);
  }, []);

  // This doesn't need to be wrapped in a fragment, but the linter
  // gets upset about us importing React if it's not like this
  return <>{children}</>;
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
