import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

const MoreVASearchTools = () => (
  <div className="usa-width-one-fourth columns">
    <h2 className="highlight vads-u-font-size--h4">
      More VA search tools
    </h2>
    <ul>
      <li>
        <va-link
          className="right-nav-link"
          href="https://search.usa.gov/search?affiliate=bvadecisions"
          text="Look up Board of Veterans' Appeals (BVA) decisions"
          onClick={() =>
            recordEvent({
              event: 'nav-searchresults',
              'nav-path':
                'More VA Search Tools -> Look up BVA decisions',
            })
          }
        />
      </li>
      <li>
        <va-link
          className="right-nav-link"
          href="/find-forms/"
          text="Find a VA form"
          onClick={() =>
            recordEvent({
              event: 'nav-searchresults',
              'nav-path': 'More VA Search Tools -> Find a VA form',
            })
          }
        />
      </li>
      <li>
        <va-link
          className="right-nav-link"
          href="https://www.va.gov/vapubs/"
          text="VA handbooks and other publications"
          onClick={() =>
            recordEvent({
              event: 'nav-searchresults',
              'nav-path':
                'More VA Search Tools -> VA handbooks and other publications',
            })
          }
        />
      </li>
      <li>
        <va-link
          className="right-nav-link"
          href="https://www.vacareers.va.gov/job-search/index.asp"
          text="Explore and apply for open VA jobs"
          onClick={() =>
            recordEvent({
              event: 'nav-searchresults',
              'nav-path':
                'More VA Search Tools -> Explore and apply for open VA jobs',
            })
          }
        />
      </li>
    </ul>
  </div>
);

export default MoreVASearchTools;