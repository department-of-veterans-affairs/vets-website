import React from 'react';
import { focusByOrder, focusElement, scrollTo } from 'platform/utilities/ui';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { createBreadcrumbListFromPath } from '../../routing';

/**
 * If the minimal header is applicable to the current app regardless of excluded paths.
 *
 * Note: Not reliable to use in a .js file load. Should be used in
 * a component or function to allow for session storage to load first.
 *
 * @returns {boolean}
 */
export function isMinimalHeaderApp() {
  return (
    sessionStorage.getItem('MINIMAL_HEADER_APPLICABLE') === 'true' ||
    document.querySelector('#header-minimal')
  );
}

/**
 * If the minimal header is applicable to the current app and the
 * current window path is not a excluded
 *
 * Note: Not reliable to use in a .js file load. Should be used in
 * a component or function to allow for session storage to load first.
 *
 * @param {string} [pathname] Defaults to `window.location.pathname` if not provided
 * @returns {boolean}
 */
export function isMinimalHeaderPath(pathname = window?.location?.pathname) {
  if (!isMinimalHeaderApp()) {
    return false;
  }

  let excludePaths = sessionStorage.getItem('MINIMAL_HEADER_EXCLUDE_PATHS');
  excludePaths = excludePaths ? JSON.parse(excludePaths) : [];
  const isExcludedPath =
    pathname && excludePaths.some(path => pathname.endsWith(path));
  return !isExcludedPath;
}

function autoGenerateBreadcrumbList() {
  return createBreadcrumbListFromPath(window.location?.pathname);
}

const Breadcrumbs = ({ breadcrumbList, homeVeteransAffairs }) => (
  <VaBreadcrumbs
    className="breadcrumbs-container"
    breadcrumbList={breadcrumbList}
    label="Breadcrumb"
    homeVeteransAffairs={homeVeteransAffairs}
  />
);

const minimalHeaderScrollAndFocus = () => {
  scrollTo('header-minimal');

  const radioHeader = document.querySelector(
    'va-radio[label-header-level="1"]',
  );
  const checkboxGroupHeader = document.querySelector(
    'va-checkbox-group[label-header-level="1"]',
  );

  if (radioHeader) {
    focusElement('h1', null, radioHeader);
  } else if (checkboxGroupHeader) {
    focusElement('h1', null, checkboxGroupHeader);
  } else {
    focusByOrder(['form h1', 'va-segmented-progress-bar']);
  }
};

/**
 * minimalHeaderFormConfigOptions
 *
 * Add this to your formConfig to enable the minimal header pattern.
 * Requires minimalHeader to be set in content-build
 *
 * Usage simple:
 *
 * ```js
 * const formConfig = {
 *   ...minimalHeaderFormConfigProps(),
 * };
 * ```
 *
 * Usage with breadcrumb overrides:
 * ```js
 * const formConfig = {
 *   ...minimalHeaderFormConfigProps({
 *     breadcrumbList: [
 *       {
 *         href: '/',
 *         label: 'VA.gov home',
 *       },
 *       {
 *         href: '/mock-form-minimal-header',
 *         label: 'Mock form minimal header',
 *       },
 *     ],
 *   }),
 * };
 * ```
 *
 * @param {Object} props
 * @param {{ href: string, label: string }[]} [props.breadcrumbList]
 * @param {boolean} [props.homeVeteransAffairs] - For breadcrumbs. When true, the first breadcrumb label will be "VA.gov home".
 * @param {React.FC<{ currentLocation: Location }>} [props.CustomTopContent] - Any additional content in addition to breadcrumbs / back link
 * @returns {FormConfig}
 */
export const minimalHeaderFormConfigOptions = ({
  breadcrumbList,
  homeVeteransAffairs,
  CustomTopContent,
} = {}) => {
  const TopContent = ({ currentLocation }) => {
    const ConditionalBreadcrumbs = isMinimalHeaderPath() ? null : (
      <Breadcrumbs
        breadcrumbList={breadcrumbList || autoGenerateBreadcrumbList()}
        homeVeteransAffairs={homeVeteransAffairs}
      />
    );

    if (CustomTopContent) {
      return (
        <>
          {ConditionalBreadcrumbs}
          {CustomTopContent({ currentLocation })}
        </>
      );
    }
    return ConditionalBreadcrumbs;
  };

  return {
    v3SegmentedProgressBar: {
      useDiv: true,
    },
    CustomTopContent: TopContent,
    useTopBackLink: true,
    hideFormTitle: true,
    hideFormTitleConfirmation: false,
    useCustomScrollAndFocus: true,
    scrollAndFocusTarget: minimalHeaderScrollAndFocus,
  };
};

Breadcrumbs.propTypes = {
  CustomTopContent: PropTypes.elementType,
  breadcrumbList: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  homeVeteransAffairs: PropTypes.bool,
};
