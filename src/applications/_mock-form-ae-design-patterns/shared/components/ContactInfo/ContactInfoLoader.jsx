import { withRouter } from 'react-router';
import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { useRouteMetadata } from './useRouteMetadata';
import useContactInfo from './useContactInfo';

const ContactInfoLoaderBase = props => {
  const { useToggleLoadingValue } = useFeatureToggle();
  const loading = useToggleLoadingValue();
  const routeMetadata = useRouteMetadata(props.router);

  const { missingFields } = useContactInfo({
    requiredKeys: props.requiredKeys,
    disableMockContactInfo: props.disableMockContactInfo,
    fullContactPath: `${routeMetadata?.urlPrefix || ''}${props.contactPath}`,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (missingFields.length > 0 && props.prefillPatternEnabled) {
    props.router.push(missingFields[0].editPath);
  }

  return <div>{props.children}</div>;
};

export const ContactInfoLoader = withRouter(ContactInfoLoaderBase);
