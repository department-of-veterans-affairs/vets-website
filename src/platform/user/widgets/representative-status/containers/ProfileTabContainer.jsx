import React from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { UnknownRep } from '../components/alerts';
import { CurrentRep } from '../components/cards';

export const ProfileTabContainer = ({
  DynamicHeader,
  DynamicSubheader,
  useRepresentativeStatus,
}) => {
  const { representative, isLoading, error } = useRepresentativeStatus();
  const { BASE_URL } = environment;

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

  const renderHasRepresentative = () => {
    return (
      <>
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
        <h2 className="vads-u-font-size--h3">
          How to replace your current accredited representative
        </h2>{' '}
        <p>
          If you appoint a new accredited representative, they will replace your
          current one.
        </p>
        <va-link
          class="home__link"
          href={`${BASE_URL}/get-help-from-accredited-representative`}
          text="Find and appoint a new accredited representative or VSO"
        />
      </>
    );
  };

  const renderNoRepresentative = () => {
    return (
      <>
        <p>You don’t have an accredited representative.</p>
        <p>
          An accredited attorney, claims agent, or Veterans Service Organization
          (VSO) representative can help you file a claim or request a decision
          review.
        </p>
        <va-link
          class="home__link"
          href={`${BASE_URL}/get-help-from-accredited-representative`}
          text="Get help from an accredited representative or VSO"
        />
      </>
    );
  };

  if (isLoading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your information..."
      />
    );
  }

  if (id) {
    return renderHasRepresentative();
  }

  if (!error && !id) {
    return renderNoRepresentative();
  }

  return <UnknownRep DynamicHeader={DynamicHeader} />;
};

ProfileTabContainer.propTypes = {
  DynamicHeader: PropTypes.string,
  DynamicSubheader: PropTypes.string,
  useRepresentativeStatus: PropTypes.func,
};
