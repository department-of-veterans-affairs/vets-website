// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const App = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <va-alert status="info">
      {/* Title */}
      <h2 slot="headline" className="vads-u-font-size--h3">
        VA Virtual Agent
      </h2>

      {/* Explanation */}
      <p>
        Use our virtual agent (chatbot) to get answers to your questions about
        VA benefits and services, and helpful links to find more information on
        our site.
      </p>

      {/* Call to action link */}
      <a
        className="vads-c-action-link--blue vads-u-margin-top--2"
        href="/virtual-agent-study/"
      >
        Chat with our Virtual Agent
      </a>
    </va-alert>
  );
};

App.propTypes = {
  // From mapStateToProps.
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.showChatbot,
});

export default connect(mapStateToProps)(App);
