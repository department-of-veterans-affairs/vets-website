import React, { useEffect, Children } from 'react';
import PropTypes from 'prop-types';
// Cypress does not like @ imports, so import record-event with a path
import recordEventFn from '~/platform/monitoring/record-event';

export const notFoundHeading = 'Sorry — we can’t find that page';

const PageNotFound = ({ recordEvent = recordEventFn } = {}) => {
  useEffect(
    () => {
      recordEvent({
        event: `nav-404-error`,
      });
    },
    [recordEvent],
  );

  useEffect(() => {
    // Hide the breadcrumbs.
    const breadcrumbs = document.getElementByClassName('va-nav-breadcrumbs');
    if (breadcrumbs) breadcrumbs.style.display = 'none';
  }, []);

  return (
    <>
      <div className="main maintenance-page vads-u-padding-top--4" role="main">
        <div className="primary">
          <div className="row">
            <div className="usa-content vads-u-text-align--center vads-u-margin-x--auto">
              <h3 id="sorry--we-cant-find-that-page">{notFoundHeading}</h3>
              <p>Try the search box or one of the common questions below.</p>
              <div className="feature vads-u-display--flex vads-u-align-items--center">
                <form
                  acceptCharset="UTF-8"
                  action="/search/"
                  id="search_form"
                  className="full-width search-form-bottom-margin"
                  method="get"
                >
                  <div
                    className="vads-u-display--flex vads-u-align-items--flex-start vads-u-justify-content--center"
                    style={{ height: '5.7rem' }}
                  >
                    <label htmlFor="mobile-query" className="sr-only">
                      Search:
                    </label>
                    <input
                      autoComplete="off"
                      className="usagov-search-autocomplete full-width vads-u-height--full vads-u-margin--0 vads-u-max-width--100"
                      id="mobile-query"
                      name="query"
                      type="text"
                    />
                    <input
                      type="submit"
                      value="Search"
                      style={{ borderRadius: '0 3px 3px 0' }}
                      className="vads-u-height--full vads-u-margin--0"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row vads-u-padding-bottom--9">
        <div className="small-12 usa-width-one-half medium-6 columns">
          <h3
            className="va-h-ruled vads-u-margin-bottom--2 vads-u-padding-bottom--1 vads-u-font-size--xl"
            id="common-questions"
          >
            Common Questions
          </h3>
          <ul className="va-list--plain vads-u-margin-top--1">
            <li className="vads-u-padding-y--1">
              <a href="/health-care/how-to-apply/">
                How do I apply for health care?
              </a>
            </li>
            <li className="vads-u-padding-y--1">
              <a href="/disability/how-to-file-claim/">
                How do I file for disability benefits?
              </a>
            </li>
            <li className="vads-u-padding-y--1">
              <a href="/education/how-to-apply/">
                How do I apply for education benefits?
              </a>
            </li>
          </ul>
        </div>
        <div className="small-12 usa-width-one-half medium-6 columns">
          <h3
            className="va-h-ruled vads-u-margin-bottom--2 vads-u-padding-bottom--1 vads-u-font-size--xl"
            id="popular-on-vagov"
          >
            Popular on VA.gov
          </h3>
          <ul className="va-list--plain vads-u-margin-top--1">
            <li className="vads-u-padding-y--1">
              <a href="/find-locations/">Find nearby VA locations</a>
            </li>
            <li className="vads-u-padding-y--1">
              <a href="/education/gi-bill-comparison-tool">
                View education benefits available by school
              </a>
            </li>
            <li className="vads-u-padding-y--1">
              <a
                target="_blank"
                href="https://www.veteranscrisisline.net/"
                rel="noopener noreferrer"
                className="external no-external-icon"
              >
                Contact the Veterans Crisis Line
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

PageNotFound.propTypes = {
  recordEvent: PropTypes.func,
};

/**
 * Recursively checks the children of a React component for the presence of
 * the PageNotFound component.
 * @param {React.Element} children the children of a component, can be null or undefined
 * @returns true if the PageNotFound component was found in any of the children
 */
export const hasPageNotFound = children => {
  if (children) {
    for (const child of Children.toArray(children)) {
      if (
        child?.type === PageNotFound ||
        hasPageNotFound(child?.props?.children)
      )
        return true;
    }
  }

  return false;
};

export default PageNotFound;
