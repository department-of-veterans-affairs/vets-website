import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { getClaimLetters } from '../actions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimLetterList from '../components/ClaimLetterList';
import WIP from '../components/WIP';
import { isLoadingFeatures, showClaimLettersFeature } from '../selectors';

export const YourClaimLetters = ({ isLoading, showClaimLetters }) => {
  const [letters, setLetters] = useState([]);
  const [lettersLoading, setLettersLoading] = useState(true);

  useEffect(() => {
    getClaimLetters().then(data => {
      setLetters(data);
      setLettersLoading(false);
    });
  }, []);

  if (isLoading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  let content;

  if (showClaimLetters) {
    content = (
      <>
        <h1>Your VA claim letters</h1>
        <div className="vads-u-font-size--lg vads-u-padding-bottom--1">
          We send you letters to update you on the status of your claims,
          appeals, and decision reviews. Download your claim letters on this
          page.
        </div>
        {lettersLoading ? (
          <va-loading-indicator message="Loading your claim letters..." />
        ) : (
          <ClaimLetterList letters={letters} />
        )}
      </>
    );
  } else {
    content = <WIP />;
  }

  return (
    <article id="claim-letters" className="row vads-u-margin-bottom--5">
      <div className="usa-width-two-thirds medium-8 columns">
        <ClaimsBreadcrumbs>
          <Link to="your-claim-letters" key="your-claim-letters">
            Your VA claim letters
          </Link>
        </ClaimsBreadcrumbs>
        {content}
      </div>
    </article>
  );
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
