import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import {
  buildMajorSteps,
  findActiveMajorStep,
} from '../utils/buildMajorStepsFromConfig';

export default function ClaimFormSideNavWC({
  enableAnalytics = false,
  formData,
  pathname,
  router,
  shouldHide = true,
}) {
  if (shouldHide) return null;

  const landingPages = buildMajorSteps(formData);
  const activePathPrefixes = findActiveMajorStep(pathname).pathPrefixes;

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

  return (
    <va-sidenav
      header={null}
      icon-background-color={null}
      icon-name={null}
      id="default-sidenav"
    >
      {landingPages.map((page, idx) => {
        const isActiveChapter = activePathPrefixes.includes(page.primaryPath);
        const label = `${idx + 1}. ${page.label}`;
        return (
          <va-sidenav-item
            key={page.key}
            label={label}
            href="#"
            current-page={isActiveChapter}
            data-page={page.key}
            onClick={e => handleClick(e, page)}
          />
        );
      })}
    </va-sidenav>
  );
}

ClaimFormSideNavWC.propTypes = {
  enableAnalytics: PropTypes.bool,
  formData: PropTypes.object,
  pathname: PropTypes.string,
  router: PropTypes.object,
  shouldHide: PropTypes.bool,
};
