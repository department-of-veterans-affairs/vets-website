import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import {
  VaSidenav,
  VaSidenavItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { buildMajorSteps } from '../utils/buildMajorStepsFromConfig';

const DISABLED_STYLE =
  'vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-left--2 vads-u-padding-right--0p5 vads-u-color--gray vads-u-border-color--gray-lightest vads-u-border-bottom--1px';
/**
 * Side navigation component for the 526EZ disability claims form
 *
 * Displays major form chapters in a navigation menu and highlights the current chapter.
 * Rebuilds navigation when save-in-progress data loads and updates active state
 * when navigating between pages.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.enableAnalytics=false] - Whether to track navigation clicks in Google Analytics
 * @param {Object} props.formData - Current form data from Redux store, used to evaluate conditional pages
 * @param {string} props.pathname - Current URL pathname from react-router
 * @param {Object} props.router - React-router router object with push method
 * @param {boolean} [props.shouldHide=true] - Whether to hide the navigation (e.g., on intro/confirmation pages)
 * @returns {React.ReactElement|null} Side navigation component or null if hidden
 */
export default function ClaimFormSideNav({
  enableAnalytics = false,
  formData,
  pathname,
  router,
  setFormData,
}) {
  /**
   * Memoize major steps with formData dependency to rebuild when save-in-progress loads
   * @type {import('../utils/buildMajorStepsFromConfig').MajorStep[]}
   */
  const landingPages = useMemo(() => buildMajorSteps(formData, pathname), [
    formData,
    pathname,
  ]);

  // maxChapterIndex helps us disable future chapter links
  const maxChapterIndex = formData['view:sideNavChapterIndex'] || 0;
  useEffect(
    () => {
      const currentChapter = landingPages.find(page => page.current);

      if (currentChapter?.idx > maxChapterIndex) {
        setFormData({
          ...formData,
          'view:sideNavChapterIndex': currentChapter.idx,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [landingPages],
  );

  /**
   * Handle navigation item click
   * @param {Event} e - Click event
   * @param {Object} pageData - Page data including key, label, and path
   */
  function handleClick(e, pageData) {
    e.preventDefault();
    const destination = pageData.path;
    if (enableAnalytics) {
      recordEvent?.({
        event: 'form-sidenav-click',
        'form-sidenav-pageData-key': pageData.key,
        'form-sidenav-pageData-label': pageData.label,
        'form-sidenav-destination-path': destination,
      });
    }
    setFormData(formData);
    router.push(destination);
  }

  return (
    <VaSidenav
      header="Form sections"
      icon-background-color="vads-color-link"
      icon-name="description"
      id="default-sidenav"
    >
      {landingPages.map((page, index) => {
        const label = `Section ${index + 1} of 6: ${page.label}`;
        if (page.current) {
          return (
            <VaSidenavItem
              key={page.key}
              label={label}
              href="#"
              current-page
              data-page={page.key}
              onClick={e => handleClick(e, page)}
            />
          );
        }

        return index <= maxChapterIndex ? (
          <VaSidenavItem
            key={page.key}
            label={label}
            href="#"
            data-page={page.key}
            onClick={e => handleClick(e, page)}
          />
        ) : (
          <p className={DISABLED_STYLE} key={page.key}>
            {label}
          </p>
        );
      })}
    </VaSidenav>
  );
}

ClaimFormSideNav.propTypes = {
  enableAnalytics: PropTypes.bool,
  formData: PropTypes.object,
  pathname: PropTypes.string,
  router: PropTypes.object,
  setFormData: PropTypes.func,
  shouldHide: PropTypes.bool,
};
