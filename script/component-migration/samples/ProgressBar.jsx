import React from 'react';
import ProgressBar from '@department-of-veterans-affairs/component-library/ProgressBar';

export const SampleProgressBar = ({ progress = 10 }) => {
  return (
    <div>
      <div>
        <ProgressBar percent={progress * 100} />
        Your files are uploading. Please do not close this window.
      </div>
    </div>
  );
};
