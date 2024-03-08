/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import recordEvent from '~/platform/monitoring/record-event';
import SearchForm from '../containers/SearchForm';
import SearchResults from '../containers/SearchResults';
import PdfAlert from './PdfAlert';

const onFeaturedContentClick = header => () => {
  recordEvent({
    event: 'nav-featured-content-link-click',
    'featured-content-header': header,
  });
};

export const FindVaForms = ({ showPdfWarningBanner = false }) => {
  return (
    <>
      {showPdfWarningBanner && <PdfAlert />}
      <SearchForm />
      <SearchResults />
      <h2>Frequently used VA forms</h2>
      <p>
        You can now do many form-based tasks online, like filing a disability
        claim and applying for the GI Bill or VA health care. We’ll walk you
        through the process step-by-step.
      </p>
      <ul
        className="usa-grid usa-grid-full vads-u-margin-top--3 vads-u-margin-bottom--4 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row"
        role="list"
      >
        <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
          <h3 className="vads-u-font-size--base vads-u-margin--0">
            File a VA disability claim
          </h3>
          <hr
            aria-hidden="true"
            role="presentation"
            className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"
          />
          <p className="va-nav-linkslist-description">
            Equal to VA Form 21-526EZ
          </p>
          <va-link
            active
            aria-label="Apply online about filing a VA disability claim"
            className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
            disable-analytics
            href="/disability/file-disability-claim-form-21-526ez/"
            onClick={onFeaturedContentClick('File a VA disability claim')}
            text="Apply online"
          />
        </li>
        <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
          <h3 className="vads-u-font-size--base vads-u-margin--0">
            Apply for the GI Bill and other education benefits
          </h3>
          <hr
            aria-hidden="true"
            role="presentation"
            className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"
          />
          <p className="va-nav-linkslist-description">
            Includes VA Forms 22-1990 and 22-1995
          </p>
          <va-link
            active
            aria-label="Learn how to apply online about applying for the GI Bill and other education benefits"
            className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
            disable-analytics
            href="/education/how-to-apply/"
            onClick={onFeaturedContentClick(
              'Apply for the GI Bill and other education benefits',
            )}
            text="Learn how to apply online"
          />
        </li>
        <li className="featured-content-list-item vads-u-background-color--primary-alt-lightest  vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-display--flex vads-u-flex-direction--column">
          <h3 className="vads-u-font-size--base vads-u-margin--0">
            Apply for VA health care
          </h3>
          <hr
            aria-hidden="true"
            role="presentation"
            className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"
          />
          <p className="va-nav-linkslist-description">
            Equal to VA Form 10-10EZ
          </p>
          <va-link
            active
            aria-label="Apply online about applying for VA health care benefits"
            className="vads-u-display--block vads-u-padding-top--1 vads-u-text-decoration--none"
            disable-analytics
            href="/health-care/apply/application/"
            onClick={onFeaturedContentClick(
              'Apply for VA health care benefits',
            )}
            text="Apply online"
          />
        </li>
      </ul>
    </>
  );
};

FindVaForms.propTypes = {
  showPdfWarningBanner: PropTypes.bool,
};

const mapStateToProps = state => ({
  showPdfWarningBanner: toggleValues(state)[
    FEATURE_FLAG_NAMES.pdfWarningBanner
  ],
});

export default connect(mapStateToProps)(FindVaForms);
