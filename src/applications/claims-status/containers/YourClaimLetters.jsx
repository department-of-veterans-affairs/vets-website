import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getClaimLetters } from '../actions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimLetterList from '../components/ClaimLetterList';
import { isLoadingFeatures, showClaimLettersFeature } from '../selectors';

export const YourClaimLetters = ({ isLoading, showClaimLetters }) => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    getClaimLetters().then(data => {
      setLetters(data);
    });
  }, []);

  if (isLoading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (showClaimLetters) {
    return (
      <article id="claim-letters" className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs />
          <h1>Your VA claim letters</h1>
          <div className="vads-u-font-size--lg vads-u-padding-bottom--1">
            We send you letters to update you on the status of your claims,
            appeals, and decision reviews. Download your claim letters on this
            page.
          </div>
          <ClaimLetterList letters={letters} />
        </div>
      </article>
    );
  }

  return <></>;
};

const mapStateToProps = state => ({
  isLoading: isLoadingFeatures(state),
  showClaimLetters: showClaimLettersFeature(state),
});

YourClaimLetters.propTypes = {
  isLoading: PropTypes.bool,
  showClaimLetters: PropTypes.bool,
};

export default connect(mapStateToProps)(YourClaimLetters);
