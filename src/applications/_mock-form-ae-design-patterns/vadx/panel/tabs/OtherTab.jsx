import React from 'react';

import { useFocusedElement } from '../../hooks/useFocusedElement';
import { HeadingHierarchyInspector } from '../HeadingHierarchyInspector';

export const OtherTab = () => {
  const { displayString, onMouseEnter, onMouseLeave } = useFocusedElement();
  return (
    <div>
      <p
        className="vads-u-display--flex vads-u-flex--auto vads-u-font-size--sm vads-u-align-items--center"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <va-icon icon="adjust" size={2} srtext="focused dom element" />
        {displayString || 'No element focused'}
      </p>

      <HeadingHierarchyInspector />
    </div>
  );
};
