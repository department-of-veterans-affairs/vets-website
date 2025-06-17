import React from 'react';

import Skeleton from '../LoadingSkeleton';

export default function ClaimCardLoadingSkeleton() {
  return (
    <Skeleton
      label="Loading your claims and appeals…"
      className="claim-list-loading-skeleton"
    >
      <Skeleton.Row height="1.5rem" width="7rem" marginBottom="1rem" />
      <Skeleton.Row height="1.5rem" width="16rem" />
      <Skeleton.Row width="12rem" marginBottom="1rem" />
      <Skeleton.Row width="16rem" />
      <Skeleton.Row width="20rem" />
      <Skeleton.Row width="16rem" marginBottom="1rem" />
      <Skeleton.Row width="6rem" />
    </Skeleton>
  );
}
