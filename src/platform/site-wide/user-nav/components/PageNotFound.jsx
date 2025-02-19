import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEventFn from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

export const notFoundHeading = 'Page not found';
export const notFoundTitle = 'Page not found | Veterans Affairs';

const searchTools = [
  { href: '/find-locations', text: 'Find a VA Location' },
  { href: '/find-forms', text: 'Find a VA form' },
  { href: '/resources', text: 'Find benefit resourcecs and support' },
  { href: '/outreach-and-events/events', text: 'Find an outreach event' },
];

const PageNotFound = ({ recordEvent = recordEventFn } = {}) => {
  useEffect(() => recordEvent({ event: `nav-404-error` }), [recordEvent]);

  useEffect(() => {
    document.title = notFoundTitle;
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container medium-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="vads-l-row">
        <div
          className="vads-l-col--12 medium-screen:vads-l-col--8"
          data-testid="page-not-found"
        >
          <h1 className="vads-u-margin-top--4">{notFoundHeading}</h1>
          <p>
            If you typed or copied the web address, check that it’s correct.
          </p>
          <p className="vads-u-measure--3">
            If you still can’t find what you’re looking for, try visiting our
            homepage or contact us for help.
          </p>
          <p>
            <va-link href="/" text="Go to our VA.gov homepage" />
          </p>
          <p>
            <va-link href="/contact-us" text="Learn how to contact us" />
          </p>

          <h2 className="va-h-ruled vads-u-font-size--h4 vads-u-margin-top--5">
            Or try these other search tools
          </h2>
          <ul className="usa-unstyled-list vads-u-margin-bottom--5">
            {searchTools.map(({ href, text }, i) => (
              <li key={`search-tool-${i}`} className="vads-u-margin-y--2">
                <va-link href={href} text={text} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

PageNotFound.propTypes = {
  recordEvent: PropTypes.func,
};

export default PageNotFound;
