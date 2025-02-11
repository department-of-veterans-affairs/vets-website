import { withRouter } from 'react-router';
import React from 'react';
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (missingFields.length > 0 && prefillPatternEnabled) {
    router.push(missingFields[0].editPath);
  }

  return <div>{children}</div>;
};

ContactInfoLoaderBase.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  contactPath: PropTypes.string,
  disableMockContactInfo: PropTypes.bool,
  prefillPatternEnabled: PropTypes.bool,
  requiredKeys: PropTypes.arrayOf(PropTypes.string),
};

export const ContactInfoLoader = withRouter(ContactInfoLoaderBase);
