import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEventFn from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

export const pageNotFoundHeading = 'Page not found';
export const pageNotFoundTitle = 'Page not found | Veterans Affairs';
export const pageNotFoundTestId = 'page-not-found';
export const pageNotFoundEvent = 'nav-404-error';

export const helpfulLinks = [
  { href: '/find-locations', text: 'Find a VA Location' },
  { href: '/find-forms', text: 'Find a VA form' },
  { href: '/resources', text: 'Find benefit resourcecs and support' },
  { href: '/outreach-and-events/events', text: 'Find an outreach event' },
];

/**
 * PageNotFound component -- renders the 404 error page.
 *
 * @component
 * @param {Object} props
 * @param {Function} [props.recordEvent=recordEventFn] - Function to record events, defaults to `recordEventFn`
 *
 * @example
 * // routes.jsx -- react-router-dom -- declare <PageNotFound /> last within <Switch />
 * import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
 * <Switch>
 *   <Route exact path="/" key="App"><App/></Route>
 *   <Route><PageNotFound /></Route>
 * </Switch>
 *
 * @example
 * // routes.jsx -- react-router-dom-v5-compat -- declare <PageNotFound /> last within <Routes />
 * import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
 * <Routes>
 *   <Route path="/" element={<App />} />
 *   <Route path="*" element={<PageNotFound />} />
 * </Routes>
 *
 * @example
 * // in _.unit.spec.jsx files:
 * import { pageNotFoundTestId } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
 * // render a 404 condition
 * const { getByTestId } = render(<App />);
 * getByTestId(pageNotFoundTestId);
 * // or, with chai assertions
 * const el = getByTestId(pageNotFoundTestId);
 * expect(el).to.exist;
 *
 * @example
 * // in _.cypress.spec.js e2e files:
 * import { pageNotFoundTestId } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
 * cy.visit('/nowhere');
 * cy.findByTestId(pageNotFoundTestId);
 */
const PageNotFound = ({ recordEvent = recordEventFn } = {}) => {
  useEffect(() => recordEvent({ event: pageNotFoundEvent }), [recordEvent]);

  useEffect(() => {
    document.title = pageNotFoundTitle;
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container medium-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="vads-l-row">
        <div
          className="vads-l-col--12 medium-screen:vads-l-col--8"
          data-testid={pageNotFoundTestId}
        >
          <h1 className="vads-u-margin-top--4">{pageNotFoundHeading}</h1>
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
            {helpfulLinks.map(({ href, text }, i) => (
              <li key={`helpful-link-${i}`} className="vads-u-margin-y--2">
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
