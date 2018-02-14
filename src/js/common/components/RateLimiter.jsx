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
    const { rateLimitAuthed = 1, rateLimitUnauthed = 1 } = window.settings[props.id] || {};
    const randomizer = Math.random();

    this.state = {
      disableRateLimit: window.sessionStorage.getItem(`${props.id}_disableRateLimit`),
      rateLimitedUnauthed: randomizer > rateLimitUnauthed,
      rateLimitedAuthed: randomizer > rateLimitAuthed
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
    const { rateLimitedUnauthed, rateLimitedAuthed } = this.state;

    if ((!state.user.profile.loading || !waitForProfile) && (
      (state.user.login.currentlyLoggedIn && !rateLimitedAuthed) ||
      (!state.user.login.currentlyLoggedIn && !rateLimitedUnauthed)
    )) {
      window.sessionStorage.setItem(`rateLimits_${id}_disableRateLimit`, 'true');
    }
  }

  render() {
    const { state, bypassLimiter, renderLimitedContent, waitForProfile, children } = this.props;

    if (waitForProfile && state.user.profile.loading) {
      return <LoadingIndicator message="Loading your profile information..."/>;
    }

    const rateLimited = state.user.login.currentlyLoggedIn
      ? this.state.rateLimitedAuthed
      : this.state.rateLimitedUnauthed;

    if (!rateLimited || this.state.disableRateLimit || (bypassLimiter && bypassLimiter(state))) {
      return children;
    }

    return renderLimitedContent(state);
  }
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(RateLimiter);
