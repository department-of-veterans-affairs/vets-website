import React from 'react';
import SegmentedProgressBar from '@department-of-veterans-affairs/component-library/SegmentedProgressBar';

export const SampleSegmentedProgressBar = ({ total = 6, current = 3 }) => {
  return (
    <div>
      <SegmentedProgressBar total={total} current={current} />
    </div>
  );
};
