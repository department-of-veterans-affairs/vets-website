import React from 'react';

export default function ProgressBar({ percent }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar-inner" style={{ width: `${percent}%` }}/>
    </div>
  );
}
