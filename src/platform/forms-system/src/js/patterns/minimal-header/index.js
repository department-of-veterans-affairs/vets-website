import React from 'react';
import {
  defaultFocusSelector,
  focusByOrder,
  focusElement,
} from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { createBreadcrumbListFromPath } from '../../routing';

/**
 * If the minimal header is applicable to the current app regardless of excluded paths.
 *
 * @returns {boolean}
 */
export function isMinimalHeaderApp() {
  // The header DOM is rendered before app-entry.js is executed,
  // so it is safe to use for initialization conditions for the app
  return document.getElementById('header-minimal') !== null;
}

/**
 * If the minimal header is applicable to the current app and the
 * current window path is not a excluded
 *
 * @param {string} [pathname] Defaults to `window.location.pathname` if not provided
 * @returns {boolean}
 */
export function isMinimalHeaderPath(pathname = window?.location?.pathname) {
  const minimalHeader = document.getElementById('header-minimal');

  if (!minimalHeader) {
    return false;
  }

  let excludePaths = minimalHeader.dataset?.excludePaths;
  excludePaths = excludePaths ? JSON.parse(excludePaths) : [];
  const isExcludedPath =
    pathname && excludePaths.some(path => pathname.endsWith(path));
  return !isExcludedPath;
}

function autoGenerateBreadcrumbList() {
  return createBreadcrumbListFromPath(window.location?.pathname);
}

const Breadcrumbs = ({ breadcrumbList, homeVeteransAffairs, wrapping }) => (
  <VaBreadcrumbs
    wrapping={wrapping}
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
    focusByOrder(['form h1', defaultFocusSelector]);
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
 * @param {boolean} [props.wrapping] - For breadcrumbs. When true, sets breadcrumb list to wrap on the page.
 * @returns {FormConfig}
 */
export const minimalHeaderFormConfigOptions = ({
  breadcrumbList,
  homeVeteransAffairs,
  CustomTopContent,
  wrapping,
} = {}) => {
  if (!isMinimalHeaderApp()) {
    return {};
  }

  const TopContent = ({ currentLocation }) => {
    const ConditionalBreadcrumbs = isMinimalHeaderPath() ? null : (
      <Breadcrumbs
        breadcrumbList={breadcrumbList || autoGenerateBreadcrumbList()}
        homeVeteransAffairs={homeVeteransAffairs}
        wrapping={wrapping}
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

  TopContent.propTypes = {
    currentLocation: PropTypes.object,
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
  wrapping: PropTypes.bool,
};
