import React from 'react';
import _ from 'lodash';

export default function SegmentedProgressBar({ current, total }) {
  return (
    <div className="progress-bar-segmented" role="progressbar" aria-valuenow={current} aria-valuemin="0" aria-valuemax={total} tabIndex="0">
      {_.range(total).map(step => (
        <div key={step} className={`progress-segment ${current > step ? 'progress-segment-complete' : ''}`}/>
      ))}
    </div>
  );
}
