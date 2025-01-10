import { withRouter } from 'react-router';
import React from 'react';
import { useRouteMetadata } from './useRouteMetadata';
import useContactInfo from './useContactInfo';

const ContactInfoLoaderBase = props => {
  const routeMetadata = useRouteMetadata(props.router);

  const { missingFields } = useContactInfo({
    requiredKeys: props.requiredKeys,
    disableMockContactInfo: props.disableMockContactInfo,
    fullContactPath: `${routeMetadata?.urlPrefix || ''}${props.contactPath}`,
  });

  if (missingFields.length > 0) {
    props.router.push(missingFields[0].editPath);
  }

  return (
    <div>
      ContactInfoLoader
      {props.children}
    </div>
  );
};

export const ContactInfoLoader = withRouter(ContactInfoLoaderBase);
