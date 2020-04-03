import React from 'react';
import SearchForm from '../containers/SearchForm';
import SearchResults from '../containers/SearchResults';

export default function() {
  return (
    <>
      <SearchForm />
      <SearchResults />
      <h2>Top tasks for frequently downloaded VA forms</h2>
      <p>
        You can now do many form tasks online, like filing a disability claim or
        applying for the GI Bill. Get started online, and we’ll walk you through
        step-by-step.
      </p>
      <ul className="usa-grid usa-grid-full vads-u-margin-top--3 vads-u-margin-bottom--4 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
          <b>File a VA disability claim</b>
          <hr className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary" />
          <p className="va-nav-linkslist-description">
            Equal to VA Form 21-526EZ
          </p>
          <a
            className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
            href="/disability/file-disability-claim-form-21-526ez"
          >
            <span>
              Read more
              <span className="vads-u-visibility--screen-reader">
                about filing a VA disability claim
              </span>
              <i className="fa fa-chevron-right vads-facility-hub-cta-arrow" />
            </span>
          </a>
        </li>
        <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
          <b>Apply for the GI Bill and other education benefits</b>
          <hr className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary" />
          <p className="va-nav-linkslist-description">
            Equal to VA Forms 22-1990 and 22-1995
          </p>
          <a
            className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
            href="/education/apply-for-education-benefits/application/1990"
          >
            <span>
              Read more
              <span className="vads-u-visibility--screen-reader">
                about applying for the GI Bill and other education benefits
              </span>
              <i className="fa fa-chevron-right vads-facility-hub-cta-arrow" />
            </span>
          </a>
        </li>
        <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
          <b>Apply for VA health care benefits</b>
          <hr className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary" />
          <p className="va-nav-linkslist-description">
            Equal to VA Form 10-10EZ
          </p>
          <a
            className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
            href="/health-care/apply/application"
          >
            <span>
              Read more
              <span className="vads-u-visibility--screen-reader">
                about applying for VA health care benefits
              </span>
              <i className="fa fa-chevron-right vads-facility-hub-cta-arrow" />
            </span>
          </a>
        </li>
      </ul>
    </>
  );
}
