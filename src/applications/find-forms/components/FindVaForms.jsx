// Node modules.
import React from 'react';
// Relative imports.
import SearchForm from '../containers/SearchForm';
import SearchResults from '../containers/SearchResults';
import recordEvent from 'platform/monitoring/record-event';

const onFeaturedContentClick = header => () => {
  recordEvent({
    event: 'nav-featured-content-link-click',
    'featured-content-header': header,
  });
};

export default () => (
  <>
    <SearchForm />
    <SearchResults />
    <h2>Frequently used VA forms</h2>
    <p>
      You can now do many form-based tasks online, like filing a disability
      claim and applying for the GI Bill or VA health care. We&apos;ll walk you
      through the process step-by-step.
    </p>
    <ul className="usa-grid usa-grid-full vads-u-margin-top--3 vads-u-margin-bottom--4 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
      <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
        <b>File a VA disability claim</b>
        <hr
          aria-hidden="true"
          role="presentation"
          className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"
        />
        <p className="va-nav-linkslist-description">
          Equal to VA Form 21-526EZ
        </p>
        <a
          className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
          href="/disability/how-to-file-claim/"
          onClick={onFeaturedContentClick('File a VA disability claim')}
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
        <hr
          aria-hidden="true"
          role="presentation"
          className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"
        />
        <p className="va-nav-linkslist-description">
          Includes VA Forms 22-1990 and 22-1995
        </p>
        <a
          className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
          href="/education/how-to-apply/"
          onClick={onFeaturedContentClick(
            'Apply for the GI Bill and other education benefits',
          )}
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
        <b>Apply for VA health care</b>
        <hr
          aria-hidden="true"
          role="presentation"
          className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"
        />
        <p className="va-nav-linkslist-description">Equal to VA Form 10-10EZ</p>
        <a
          className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
          href="/health-care/apply/application/introduction"
          onClick={onFeaturedContentClick('Apply for VA health care benefits')}
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
