import React, { useEffect } from 'react';
import { useStore, connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import repStatusLoader from 'platform/user/widgets/representative-status';

import { fetchPowerOfAttorney as fetchPowerOfAttorneyAction } from '@@profile/actions';

const AccreditedRepresentative = ({
  fetchPowerOfAttorney,
  powerOfAttorney,
}) => {
  const { BASE_URL } = environment;
  const hasRepresentative = !!powerOfAttorney?.id;
  const store = useStore();

  // storing POA response to prevent redundant request from within the Rep Status tool
  const setPOACookie = cookieValue => {
    const expirationTime = new Date(new Date().getTime() + 5 * 60 * 1000);
    Cookies.set('powerOfAttorney', cookieValue, { expires: expirationTime });
  };

  useEffect(
    () => {
      if (hasRepresentative) {
        setPOACookie(powerOfAttorney);
        repStatusLoader(store, 'representative-status', 3);
      }
    },
    [hasRepresentative],
  );

  useEffect(() => {
    fetchPowerOfAttorney();
  }, []);

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
          text="Get help from an accredited representative or VSO"
        />
      </>
    );
  };

  return (
    <>
      <h1
        tabIndex="-1"
        className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Accredited Representative or VSO
      </h1>

      {hasRepresentative ? renderHasRepresentative() : renderNoRepresentative()}
    </>
  );
};

AccreditedRepresentative.propTypes = {
  powerOfAttorney: PropTypes.object,
  fetchPowerOfAttorney: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  powerOfAttorney: state.vaProfile?.powerOfAttorney,
});

const mapDispatchToProps = {
  fetchPowerOfAttorney: fetchPowerOfAttorneyAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccreditedRepresentative);
