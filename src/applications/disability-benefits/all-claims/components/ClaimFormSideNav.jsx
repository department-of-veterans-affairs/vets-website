import React, { useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import {
  VaSidenav,
  VaSidenavItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { buildMajorSteps } from '../utils/buildMajorStepsFromConfig';

const DISABLED_STYLE =
  'vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-left--2 vads-u-padding-right--0p5 vads-u-color--gray vads-u-border-color--gray-lightest vads-u-border-bottom--1px';

const PREVIOUS_STEP_STYLE =
  'vads-u-color--link vads-u-text-decoration--underline';
/**
 * Side navigation component for the 526EZ disability claims form
 *
 * Displays major form chapters in a navigation menu and highlights the current chapter.
 * Tracks the user's progress through chapters using 'view:sideNavChapterIndex' to disable
 * future chapter links. Rebuilds navigation when save-in-progress data loads and updates
 * active state when navigating between pages.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.enableAnalytics=false] - Whether to track navigation clicks in Google Analytics
 * @param {Object} props.formData - Current form data from Redux store, used to evaluate conditional pages
 * @param {string} props.pathname - Current URL pathname from react-router
 * @param {Object} props.router - React-router router object with push method
 * @param {Function} props.setFormData - Redux action to update form data
 * @returns {React.ReactElement} Side navigation component
 */
export default function ClaimFormSideNav({
  enableAnalytics = false,
  formData,
  pathname,
  router,
  setFormData,
}) {
  /**
   * Ref to access the VaSidenav shadow DOM for mobile accordion control
   */
  const sidenavRef = useRef(null);

  /**
   * Memoize major steps with formData and pathname dependencies
   * Rebuilds when save-in-progress loads or when navigating between pages
   * @type {import('../utils/buildMajorStepsFromConfig').MajorStep[]}
   */
  const landingPages = useMemo(() => buildMajorSteps(formData, pathname), [
    formData,
    pathname,
  ]);

  /**
   * Track the highest chapter index the user has reached
   * Used to disable navigation links for future chapters
   */
  const maxChapterIndex = formData['view:sideNavChapterIndex'] || 0;

  /**
   * Update maxChapterIndex when user progresses to a new chapter
   * Uses functional update to avoid stale closure and prevent setState-in-render warnings
   */
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
   * Close mobile accordion when navigating between pages
   */
  useEffect(
    () => {
      if (sidenavRef.current) {
        const accordionItem = sidenavRef.current.shadowRoot?.querySelector(
          'va-accordion > va-accordion-item',
        );

        if (accordionItem) {
          // Save current scroll position before closing accordion
          const { scrollY } = window;

          accordionItem.removeAttribute('open');

          // Restore scroll position to prevent accordion close from scrolling
          window.scrollTo(0, scrollY);
        }
      }
    },
    [pathname],
  );

  /**
   * Handle navigation item click
   * Tracks analytics if enabled and navigates to the selected chapter
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
      ref={sidenavRef}
      header="Form steps"
      icon-background-color="vads-color-link"
      icon-name="description"
      id="default-sidenav"
    >
      {landingPages.map((page, index) => {
        const label = `Step ${index + 1}: ${page.label}`;
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

        // page.idx instead of index for optional chapters that may
        //  be included after being skipped (see CFI flow)
        return page.idx <= maxChapterIndex ? (
          <VaSidenavItem
            key={page.key}
            label={label}
            href="#"
            data-page={page.key}
            className={PREVIOUS_STEP_STYLE}
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
