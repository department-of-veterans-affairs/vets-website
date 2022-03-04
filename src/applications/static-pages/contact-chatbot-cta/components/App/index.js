// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const restrictWidgetStorageKey = 'restrict-chatbot-cta';
const displayThreshold = 25;

export const App = () => {
  // restrict view to roughly 25% of users
  const restrictDisplay = () => {
    const restrict = window.localStorage.getItem(restrictWidgetStorageKey);
    if (restrict) {
      return Number.parseInt(restrict, 10) <= displayThreshold;
    }
    const restrictVar = Math.random().toFixed(2) * 100;
    window.localStorage.setItem(
      restrictWidgetStorageKey,
      restrictVar.toString(),
    );
    return restrictVar <= displayThreshold;
  };

  const isAllowed = restrictDisplay();
  if (!isAllowed) {
    return null;
  }

  return (
    <va-alert status="info">
      {/* Title */}
      <h2 slot="headline" className="vads-u-font-size--h3">
        VA virtual agent
      </h2>

      {/* Explanation */}
      <p>
        You can also use our virtual agent (chatbot) to get information about VA
        benefits and services.
      </p>

      {/* Call to action link */}
      <a
        className="vads-c-action-link--blue vads-u-margin-top--2"
        href="/contact-us/virtual-agent/"
      >
        Go to the virtual agent
      </a>
    </va-alert>
  );
};

App.propTypes = {
  // From mapStateToProps.
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.showContactChatbot,
});

export default connect(mapStateToProps)(App);
