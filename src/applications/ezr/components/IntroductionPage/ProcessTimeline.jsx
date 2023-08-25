import React from 'react';
import content from '../../locales/en/content.json';

const ProcessTimeline = () => (
  <>
    <h2 className="vads-u-font-size--h3">{content['intro-process-title']}</h2>
    <va-process-list>
      <li>
        <h3 className="vads-u-font-size--h4">Step One</h3>
        <p>Step one content</p>
      </li>
      <li>
        <h3 className="vads-u-font-size--h4">Step Two</h3>
        <p>Step two content</p>
      </li>
      <li>
        <div>
          <h3 className="vads-u-font-size--h4">Step Three</h3>
        </div>
        <p>Step three content</p>
      </li>
    </va-process-list>
  </>
);

export default ProcessTimeline;
