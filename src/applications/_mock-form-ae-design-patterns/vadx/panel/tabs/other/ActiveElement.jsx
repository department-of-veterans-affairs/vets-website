import React from 'react';
import { useFocusedElement } from '../../../hooks/useFocusedElement';

export const ActiveElement = () => {
  const { displayString, onMouseEnter, onMouseLeave } = useFocusedElement();
  return (
    <div className="vads-u-margin-y--1">
      <p className="vads-u-font-size--sm vads-u-margin-y--0">Active element:</p>
      <p
        className="vads-u-display--flex vads-u-font-size--sm vads-u-flex--auto vads-u-align-items--center vads-u-margin-y--0"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <va-icon icon="adjust" size={2} srtext="focused dom element" />
        <span className="vads-u-margin-left--0p5">
          {displayString || 'No element focused'}
        </span>
      </p>
    </div>
  );
};
