import React from 'react';

const MoreVASearchTools = () => (
  <ul>
    <li>
      <va-link
        href="https://search.usa.gov/search?affiliate=bvadecisions"
        text="Look up Board of Veterans' Appeals (BVA) decisions"
      />
    </li>
    <li>
      <va-link href="/forms/" text="Find a VA form" />
    </li>
    <li>
      <va-link
        href="https://www.va.gov/vapubs/"
        text="VA handbooks and other publications"
      />
    </li>
    <li>
      <va-link
        href="https://www.vacareers.va.gov/job-search/index.asp"
        text="Explore and apply for open VA jobs"
      />
    </li>
  </ul>
);

export default MoreVASearchTools;
