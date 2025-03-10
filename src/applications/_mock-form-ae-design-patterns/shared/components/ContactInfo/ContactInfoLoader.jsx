/* eslint-disable no-console */
import { withRouter } from 'react-router';
import React, { useEffect } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import PropTypes from 'prop-types';
import { useRouteMetadata } from './useRouteMetadata';
import useContactInfo from './useContactInfo';

const ContactInfoLoaderBase = ({
  router,
  children,
  requiredKeys,
  disableMockContactInfo,
  contactPath,
  prefillPatternEnabled,
}) => {
  const { useToggleLoadingValue } = useFeatureToggle();
  const loading = useToggleLoadingValue();
  const routeMetadata = useRouteMetadata(router);

  const { missingFields } = useContactInfo({
    requiredKeys,
    disableMockContactInfo,
    fullContactPath: `${routeMetadata?.urlPrefix || ''}${contactPath}`,
  });

  useEffect(
    () => {
      const handlePopState = () => {
        const historyStack =
          JSON.parse(sessionStorage.getItem('historyStack')) || [];
        if (historyStack.length > 0) {
          historyStack.pop();
          sessionStorage.setItem('historyStack', JSON.stringify(historyStack));
        }
      };

      window.addEventListener('popstate', handlePopState);

      if (missingFields.length > 0 && prefillPatternEnabled) {
        const currentPath = router.location.pathname;
        const historyStack =
          JSON.parse(sessionStorage.getItem('historyStack')) || [];

        if (!historyStack.includes(currentPath)) {
          historyStack.push(currentPath);
          sessionStorage.setItem('historyStack', JSON.stringify(historyStack));
        }

        sessionStorage.setItem('lastPath', currentPath);

        router.replace(missingFields[0].editPath);
      }
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    },
    [missingFields, prefillPatternEnabled, router],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (missingFields.length > 0 && prefillPatternEnabled) {
  //   router.push(missingFields[0].editPath);
  // }

  return <div>{children}</div>;
};

ContactInfoLoaderBase.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  contactPath: PropTypes.string,
  disableMockContactInfo: PropTypes.bool,
  prefillPatternEnabled: PropTypes.bool,
  requiredKeys: PropTypes.arrayOf(PropTypes.string),
};

export const ContactInfoLoader = withRouter(ContactInfoLoaderBase);
