import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import {
  VaSidenav,
  VaSidenavItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  buildMajorSteps,
  findActiveMajorStep,
} from '../utils/buildMajorStepsFromConfig';

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
export default function ClaimFormSideNavWC({
  enableAnalytics = false,
  formData,
  pathname,
  router,
  shouldHide = true,
}) {
  /**
   * Memoize major steps with formData dependency to rebuild when save-in-progress loads
   * @type {import('../utils/buildMajorStepsFromConfig').MajorStep[]}
   */
  const landingPages = useMemo(() => buildMajorSteps(formData), [formData]);

  /**
   * Calculate active step on every render to ensure it's always current.
   * Not memoized because pathname changes frequently and we want immediate updates.
   * @type {import('../utils/buildMajorStepsFromConfig').MajorStep}
   */
  const activeStep = findActiveMajorStep(pathname, formData) || {};

  /**
   * Handle navigation item click
   * @param {Event} e - Click event
   * @param {Object} pageData - Page data including key, label, and primaryPath
   */
  function handleClick(e, pageData) {
    e.preventDefault();
    if (enableAnalytics) {
      recordEvent?.({
        event: 'form-sidenav-click',
        'form-sidenav-pageData-key': pageData.key,
        'form-sidenav-pageData-label': pageData.label,
        'form-sidenav-destination-path': pageData.primaryPath,
      });
    }
    router.push(pageData.primaryPath);
  }

  if (shouldHide) return null;

  return (
    <VaSidenav
      header={null}
      icon-background-color={null}
      icon-name={null}
      id="default-sidenav"
    >
      {landingPages.map((page, idx) => {
        /** Check if current pathname matches ANY of this page's prefixes AND keys match */
        const isActiveChapter =
          activeStep.pathPrefixes?.some(prefix =>
            pathname.toLowerCase().startsWith(prefix.toLowerCase()),
          ) && activeStep.key === page.key;

        const label = `${idx + 1}. ${page.label}`;
        return (
          <VaSidenavItem
            key={page.key}
            label={label}
            href="#"
            current-page={isActiveChapter}
            data-page={page.key}
            onClick={e => handleClick(e, page)}
          />
        );
      })}
    </VaSidenav>
  );
}

ClaimFormSideNavWC.propTypes = {
  enableAnalytics: PropTypes.bool,
  formData: PropTypes.object,
  pathname: PropTypes.string,
  router: PropTypes.object,
  shouldHide: PropTypes.bool,
};
