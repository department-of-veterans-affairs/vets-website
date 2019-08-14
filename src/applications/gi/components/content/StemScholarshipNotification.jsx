import React from 'react';
import environment from '../../../../platform/utilities/environment';

export const StemScholarshipNotification = () => (
  <div className="stem-notification">
    <span className="usa-label">New</span>
    <div className="feature">
      <h4>The Edith Nourse Rogers STEM Scholarship</h4>
      <p>
        {environment.isProduction() &&
          'On August 1, 2019, VA is launching the Edith Nourse Rogers STEM Scholarship for students enrolled in a high-demand STEM (Science, Technology, Engineering, and Math) program.'}
        {!environment.isProduction() &&
          'On August 1, 2019, VA launched the Edith Nourse Rogers STEM Scholarship for students enrolled in a high-demand STEM (Science, Technology, Engineering, and Math) program.'}
      </p>
      <p>
        To learn more about this scholarship,{' '}
        <a
          href="https://benefits.va.gov/gibill/fgib/stem.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          visit the Edith Nourse Rogers STEM Scholarship website
        </a>
        .
      </p>
    </div>
  </div>
);

export default StemScholarshipNotification;
