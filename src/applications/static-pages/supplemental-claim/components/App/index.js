// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const App = ({ show }) => {
  return show ? (
    <div>
      <h2>How do I file a Supplemental Claim?</h2>
      <p>You can file a Supplemental Claim online right now.</p>
      <a
        href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995"
        className="vads-c-action-link--green"
      >
        File a Supplemental Claim
      </a>
    </div>
  ) : (
    <div>
      <h2>How do I file a Supplemental Claim?</h2>
    </div>
  );
};

App.propTypes = {
  // From mapStateToProps.
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.supplementalClaim,
});

export default connect(
  mapStateToProps,
  null,
)(App);
