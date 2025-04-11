import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { UnknownRep } from './alerts';
import { CurrentRep, NoRep } from './cards';

// Todo: rename this component
export const CheckUsersRep = ({
  DynamicHeader,
  DynamicSubheader,
  useRepresentativeStatus,
}) => {
  const { representative, isLoading, error } = useRepresentativeStatus();
  const {
    poaType,
    name,
    addressLine1,
    addressLine2,
    city,
    id,
    stateCode,
    zipCode,
    email,
    contact,
    extension,
    concatAddress,
    vcfUrl,
  } = representative ?? {};
  const isPostLogin = document.location.search?.includes('postLogin=true');

  useEffect(() => {
    if (isPostLogin) {
      focusElement('.poa-display');
    }
  }, [isPostLogin]);

  if (isLoading) {
    return (
      <va-card show-shadow>
        <va-loading-indicator
          label="Loading"
          message="Loading your information..."
        />
      </va-card>
    );
  }

  if (id) {
    return (
      <CurrentRep
        DynamicHeader={DynamicHeader}
        DynamicSubheader={DynamicSubheader}
        poaType={poaType}
        name={name}
        addressLine1={addressLine1}
        addressLine2={addressLine2}
        city={city}
        stateCode={stateCode}
        zipCode={zipCode}
        email={email}
        contact={contact}
        extension={extension}
        concatAddress={concatAddress}
        vcfUrl={vcfUrl}
      />
    );
  }

  if (!error && !id) {
    return <NoRep DynamicHeader={DynamicHeader} />;
  }

  return <UnknownRep DynamicHeader={DynamicHeader} />;
};

CheckUsersRep.propTypes = {
  DynamicHeader: PropTypes.string,
  DynamicSubheader: PropTypes.string,
  useRepresentativeStatus: PropTypes.func,
};
