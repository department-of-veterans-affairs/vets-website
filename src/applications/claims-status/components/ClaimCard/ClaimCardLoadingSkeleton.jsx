import React from 'react';
import PropTypes from 'prop-types';

import LoadingSkeleton from '../LoadingSkeleton';

/**
 * @component
 * A loading skeleton specifically designed for claim cards.
 *
 * @param {boolean} [isLoading=true] Indicates whether content is loading. When true, displays skeleton. When false, renders empty but announces "Claims and appeals have loaded" to screen readers for accessibility.
 */
export default function ClaimCardLoadingSkeleton({ isLoading = true }) {
  return (
    <LoadingSkeleton
      id="claim-card"
      isLoading={isLoading}
      srLabel="Loading your claims and appeals…"
      srLoadedLabel="Claims and appeals have loaded"
    >
      <LoadingSkeleton.Row height="1.5rem" width="7rem" marginBottom="1rem" />
      <LoadingSkeleton.Row height="1.5rem" width="16rem" />
      <LoadingSkeleton.Row width="12rem" marginBottom="1rem" />
      <LoadingSkeleton.Row width="16rem" />
      <LoadingSkeleton.Row width="20rem" />
      <LoadingSkeleton.Row width="16rem" marginBottom="1rem" />
      <LoadingSkeleton.Row width="6rem" />
    </LoadingSkeleton>
  );
}

ClaimCardLoadingSkeleton.propTypes = {
  isLoading: PropTypes.bool,
};
