import React from 'react';
import { Link, withRouter } from 'react-router';
import {
  createPageList,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { getPreviousPagePath } from 'platform/forms-system/src/js/routing';

/**
 * A prototype custom header for new UX and accessibility changes
 * A light blue bar across the top of each page of the form.
 * Contains the form title with form id, a back link, and an exit form link.
 */
const CustomHeader = ({ formData, formConfig, router, currentLocation }) => {
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const { additionalRoutes } = formConfig;
  let nonFormPages = [];
  if (additionalRoutes) {
    nonFormPages = additionalRoutes.map(route => route.path);
  }
  const lastPathComponent = currentLocation.pathname.split('/').pop();
  const isIntroductionPage = trimmedPathname.endsWith('introduction');
  const isNonFormPage = nonFormPages.includes(lastPathComponent);
  const isReviewPage = trimmedPathname.endsWith('review-and-submit');

  function goBack() {
    const formPages = createFormPageList(formConfig);
    const pageList = createPageList(formConfig, formPages);

    const path = getPreviousPagePath(
      pageList,
      formData,
      currentLocation.pathname,
    );

    router.push(path);
  }

  return !isIntroductionPage && !isNonFormPage && !isReviewPage ? (
    <div className="vads-u-background-color--primary-alt-lightest vads-u-padding-y--2 vads-u-margin-bottom--2">
      <div className="row">
        <div className="vads-u-margin-x--2p5">
          <div className="vads-u-font-size--h4 vads-u-font-family--serif vads-u-margin-bottom--2 vads-u-font-weight--bold">
            {formConfig.title} ({formConfig.formId})
          </div>
          <div className="rjsf-form-custom-header vads-u-display--flex vads-u-justify-content--space-between small-screen:vads-u-justify-content--flex-start">
            <span>
              <i
                aria-hidden="true"
                className="fas fa-arrow-left va-c-font-size--xs vads-u-margin-top--1 vads-u-margin-right--0p5 vads-u-color--gray-medium"
              />
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link onClick={goBack} className="vads-u-margin-right--4">
                Back
              </Link>
            </span>
            <Link to="/">Exit form</Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // With this custom header, breadcrumbs should not appear on the form pages.
    // However we still want to show them on the introduction page and review page.
    // Static breadcrumbs from content-build cannot be used with this custom header
    <va-breadcrumbs label="Breadcrumb">
      <a href="/">Home</a>
      <a href="/authorization-to-disclose-alternate/">
        Authorize VA to release your information to a third-party source
      </a>
    </va-breadcrumbs>
  );
};

export default withRouter(CustomHeader);
