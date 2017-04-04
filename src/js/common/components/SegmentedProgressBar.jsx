import React from 'react';
import _ from 'lodash';

/**
 * Create a segmented progress bar for multi-page forms.
 *
 * @param {number} current - The index of the current chapter
 * @param {number} total   - The total number of chapters in the form
 */
export default function SegmentedProgressBar({ current, total }) {
  return (
    <div className="progress-bar-segmented" role="progressbar" aria-valuenow={current} aria-valuemin="0" aria-valuemax={total} tabIndex="0">
      {_.range(total).map(step => (
        <div key={step} className={`progress-segment ${current > step ? 'progress-segment-complete' : ''}`}/>
      ))}
    </div>
  );
}
