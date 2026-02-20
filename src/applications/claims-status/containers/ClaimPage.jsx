import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import {
  clearClaim as clearClaimAction,
  getClaim as getClaimAction,
} from '../actions';

export function ClaimPage({ clearClaim, getClaim }) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstMultiClaimProviderEnabled = useToggleValue(
    TOGGLE_NAMES.cstMultiClaimProvider,
  );

  useEffect(() => {
    const provider = cstMultiClaimProviderEnabled
      ? searchParams.get('type')
      : null;
    getClaim(params.id, navigate, provider);
    // Reset claim and loading state on dismount.
    return () => clearClaim();
  }, []);

  return <Outlet />;
}

const mapDispatchToProps = {
  getClaim: getClaimAction,
  clearClaim: clearClaimAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(ClaimPage);

ClaimPage.propTypes = {
  clearClaim: PropTypes.func,
  getClaim: PropTypes.func,
};
