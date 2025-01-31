import React from 'react';
import {
  focusByOrder,
  focusElement,
  scrollTo,
  // waitForRenderThenFocus,
} from 'platform/utilities/ui';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

/**
 * If the minimal header is applicable to the current app regardless of excluded paths.
 *
 * Note: Not reliable to use in a .js file load. Should be used in
 * a component or function to allow for session storage to load first.
 *
 * @returns {boolean}
 */
export function isMinimalHeaderApp() {
  return sessionStorage.getItem('MINIMAL_HEADER_APPLICABLE') === 'true';
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

function breadcrumbItem(label, href) {
  return { label, href };
}

function generateBreadcrumbList(pathname) {
  const breadcrumbList = [breadcrumbItem('VA.gov home', '/')];

  try {
    // pathname = '/my-form/introduction'
    const pathParts = pathname.split('/').filter(Boolean);
    // pathParts = ['my-form', 'introduction']
    pathParts.pop();
    // pathParts = ['my-form']

    const otherBreadcrumbList = pathParts.map((part, index) => {
      // part = 'my-form'
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      // label = 'My-form'
      label = label.replace(/-/g, ' ');
      // label = 'My form'
      const href = `/${pathParts.slice(0, index + 1).join('/')}`;
      return breadcrumbItem(label, href);
    });
    breadcrumbList.push(...otherBreadcrumbList);
  } catch (error) {
    // suppress error - Just use Home breadcrumb
  }
  return breadcrumbList;
}

function autoGenerateBreadcrumbList() {
  return generateBreadcrumbList(window.location?.pathname);
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

  // If we have something with `label-header-level`, then that is likely
  // the title of the page, so we should focus on that.
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
 * Default form config options for minimal header pattern.
 *
 * Requires corresponding minimalHeader to be set in content-build for the form.
 *
 * Usage:
 *
 * ```js
 * const formConfig = {
 *   // simple - auto detect breadcrumbs on excluded pages
 *   ...minimalHeaderFormConfigProps(),
 *
 *   // customize breadcrumbs on excluded pages
 *   ...minimalHeaderFormConfigProps({
 *     breadcrumbList: [
 *       {
 *         href: '/',
 *         label: 'Home',
 *       },
 *       {
 *         href: '/mock-form-minimal-header',
 *         label: 'Mock form minimal header',
 *       },
 *     ],
 *     homeVeteransAffairs: true,
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
