import React, { useEffect } from 'react';
// import { format } from 'date-fns';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

// import extraData from '../tests/fixtures/data/extra-data.json';
// import testData from '../tests/fixtures/data/test-data.json';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  });

  // const { data } = testData;
  // const { fullName } = extraData;

  return (
    <div className="row vads-u-margin-bottom--4">
      <div className="usa-width-two-thirds medium-8 columns">
        <div name="topScrollElement" />
        <va-breadcrumbs>
          <a href="/">Home</a>
          <a href="/decision-reviews">Decision reviews and appeals</a>
          <a href="/decision-reviews/board-appeal">Board Appeals</a>
          <a href="/decision-reviews/submitted-appeal">
            Your submitted Board Appeal
          </a>
        </va-breadcrumbs>
        <h1>Your submitted Board Appeal</h1>
        <div className="schemaform-subtitle">
          VA Form 10182 (Notice of Disagreement)
        </div>

        <h2 className="vads-u-font-size--h3">
          Board Appeal submitted on December 1, 2023
        </h2>
        <p>
          You can review the answers you’ve submitted. Bookmark this page for
          your records.
        </p>

        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Download a copy of your Board Appeal (PDF)
          </h3>
          <p>
            If you’d like a PDF copy of your completed Board Appeal, you can
            download it now. The download link is only available until December
            8, 2023.
          </p>

          <va-link
            download
            href="#"
            text="Download a copy of your Board Appeal (PDF)"
          />
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
