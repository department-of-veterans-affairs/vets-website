import React from 'react';

import { HeadingHierarchyInspector } from './HeadingHierarchyInspector';
import { MemoryUsage } from './MemoryUsage';
import { ActiveElement } from './ActiveElement';

export const OtherTab = () => {
  return (
    <div>
      <MemoryUsage />
      <ActiveElement />
      <HeadingHierarchyInspector />
    </div>
  );
};
