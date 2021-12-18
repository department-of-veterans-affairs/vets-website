import React from 'react';
import ProgressBar from '@department-of-veterans-affairs/component-library/ProgressBar';

export const SampleProgressBar = ({ percent = 10 }) => {
  return (
    <div>
      <div>
        <ProgressBar percent={percent} />
        Your files are uploading. Please do not close this window.
      </div>
    </div>
  );
};
