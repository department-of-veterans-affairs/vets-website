import React from 'react';

import { HeadingHierarchyInspector } from './HeadingHierarchyInspector';
import { MemoryUsage } from './MemoryUsage';
import { ActiveElement } from './ActiveElement';
import { LoggedInState } from './LoggedInState';

export const OtherTab = () => {
  return (
    <div>
      <MemoryUsage />
      <LoggedInState />
      <ActiveElement />
      <HeadingHierarchyInspector />
    </div>
  );
};
