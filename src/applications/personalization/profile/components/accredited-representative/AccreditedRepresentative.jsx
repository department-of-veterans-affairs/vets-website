import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { connect, useStore } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useRepresentativeStatus } from 'platform/user/widgets/representative-status/hooks/useRepresentativeStatus';
import {
  CurrentRep,
  NoRep,
} from 'platform/user/widgets/representative-status/components/cards';
import { UnknownRep } from 'platform/user/widgets/representative-status/components/alerts';
import repStatusLoader from 'platform/user/widgets/representative-status';
import { isLOA3 as isLOA3Selector } from '~/platform/user/selectors';

const AccreditedRepresentative = ({ isLOA3 }) => {
  const store = useStore();

  useEffect(() => {
    focusElement('.rep-section-header');
    repStatusLoader(store, 'representative-status', 2);
  }, []);

  const { representative, isLoading, error } = useRepresentativeStatus();
  const { BASE_URL } = environment;
  const baseHeader = 3;
  const DynamicHeader = `h${baseHeader}`;
  const DynamicSubheader = `h${baseHeader + 1}`;

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
      <div data-testid="current-rep">
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
      </div>
    );
  };

  const content = () => {
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

    if ((isLOA3 && !id) || (!error && !id)) {
      return <NoRep />;
    }

    return <UnknownRep DynamicHeader={DynamicHeader} />;
  };

  return (
    <>
      <h1
        tabIndex="-1"
        className="vads-u-margin-bottom--2 rep-section-header"
        data-focus-target
      >
        Accredited Representative or VSO
      </h1>
      {content()}
    </>
  );
};

AccreditedRepresentative.propTypes = {
  isLOA3: PropTypes.bool.isRequired,
};

export const mapStateToProps = state => {
  const isLOA3 = isLOA3Selector(state);

  return {
    isLOA3,
  };
};

export default connect(mapStateToProps)(AccreditedRepresentative);
