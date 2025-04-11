import React, { useEffect } from 'react';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { useStore, connect } from 'react-redux';
import PropTypes from 'prop-types';

import repStatusLoader from 'platform/user/widgets/representative-status';

const AccreditedRepresentative = ({ powerOfAttorney }) => {
  const { BASE_URL } = environment;
  const hasRepresentative = !!powerOfAttorney?.id;
  const store = useStore();

  useEffect(
    () => {
      if (hasRepresentative) {
        repStatusLoader(store, 'representative-status', 3);
      }
    },
    [hasRepresentative],
  );

  const renderHasRepresentative = () => {
    return (
      <>
        <div data-widget-type="representative-status" />
        <h3>How to replace your current representative</h3>
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
          text="Get help from an accredited representative"
        />
      </>
    );
  };

  return (
    <>
      <h2>Accredited Representative or VSO</h2>

      {hasRepresentative ? renderHasRepresentative() : renderNoRepresentative()}
    </>
  );
};

AccreditedRepresentative.propTypes = {
  powerOfAttorney: PropTypes.object,
};

const mapStateToProps = state => ({
  powerOfAttorney: state.vaProfile?.powerOfAttorney,
});

export default connect(mapStateToProps)(AccreditedRepresentative);
