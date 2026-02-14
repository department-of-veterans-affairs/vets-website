import React from 'react';

const MoreVASearchTools = () => (
  <ul className="more-va-search-tools-list vads-u-margin-top--0 vads-u-margin-bottom--0">
    <li className="more-va-search-tools-item">
      <va-link
        href="https://search.usa.gov/search?affiliate=bvadecisions"
        text="Look up Board of Veterans' Appeals (BVA) decisions"
      />
    </li>
    <li className="more-va-search-tools-item">
      <va-link href="/forms/" text="Find a VA form" />
    </li>
    <li className="more-va-search-tools-item">
      <va-link
        href="https://www.va.gov/vapubs/"
        text="VA handbooks and other publications"
      />
    </li>
    <li className="more-va-search-tools-item">
      <va-link
        href="https://www.vacareers.va.gov/job-search/index.asp"
        text="Explore and apply for open VA jobs"
      />
    </li>
  </ul>
);

export default MoreVASearchTools;
