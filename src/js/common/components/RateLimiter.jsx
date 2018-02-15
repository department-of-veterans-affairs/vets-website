import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from './LoadingIndicator';

/*
 * Expects a settings object that looks like:
 *
 * settings: {
 *   [id]: {
 *     rateLimitAuthed: 1,
 *     rateLimitUnauthed: 1
 *   }
 * }
 */
export class RateLimiter extends React.Component {
  constructor(props) {
    super(props);
    // 0 is nothing gets through, 1 is everything gets through
    const { rateLimitAuthed = 0, rateLimitUnauthed = 0 } = window.settings[props.id] || {};
    const randomizer = Math.random();

    this.state = {
      rateLimitDisabled: window.sessionStorage.getItem(`${props.id}_rateLimitDisabled`),
      passedUnauthedRateLimit: randomizer < rateLimitUnauthed,
      passedAuthedRateLimit: randomizer < rateLimitAuthed
    };
  }

  componentDidMount() {
    this.disableRateLimitIfNecessary();
  }

  componentDidUpdate() {
    this.disableRateLimitIfNecessary();
  }

  disableRateLimitIfNecessary = () => {
    const { state, waitForProfile, id } = this.props;
    const { passedAuthedRateLimit, passedUnauthedRateLimit } = this.state;

    if ((!state.user.profile.loading || !waitForProfile) && (
      (state.user.login.currentlyLoggedIn && passedAuthedRateLimit) ||
      (!state.user.login.currentlyLoggedIn && passedUnauthedRateLimit)
    )) {
      window.sessionStorage.setItem(`${id}_rateLimitDisabled`, 'true');
    }
  }

  render() {
    const { state, bypassLimit, renderLimitedContent, waitForProfile, children } = this.props;

    if (waitForProfile && state.user.profile.loading) {
      return <LoadingIndicator message="Loading your profile information..."/>;
    }

    const passedRateLimit = state.user.login.currentlyLoggedIn
      ? this.state.passedAuthedRateLimit
      : this.state.passedUnauthedRateLimit;

    if (passedRateLimit || this.state.rateLimitDisabled || (bypassLimit && bypassLimit(state))) {
      return children;
    }

    return renderLimitedContent(state);
  }
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(RateLimiter);
