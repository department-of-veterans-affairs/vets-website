import React from 'react';
import { connect } from 'react-redux';

/*
 * settings: {
 *   rateLimits: {
 *     [id]: {
 *       authed: .7
 *       unauthed: .6
 *     }
 *   }
 * }
 */
export class RateLimiter extends React.Component {
  constructor(props) {
    super(props);
    const rateLimit = window.settings.rateLimits
      ? {}
      : window.settings.rateLimits[props.id];
    const randomizer = Math.random();

    this.state = {
      disableRateLimit: window.sessionStorage.getItem(`rateLimits_${props.id}_disableRateLimit`),
      rateLimitedUnauthed: randomizer > rateLimit.unauthed || 0,
      rateLimitedAuthed: randomizer > rateLimit.authed || 0
    };
  }

  componentDidMount() {
    this.disableRateLimitIfNecessary();
  }

  componentDidUpdate() {
    this.disableRateLimitIfNecessary();
  }

  disableRateLimitIfNecessary = () => {
    if (!this.props.state.user.profile.inProgress && (
      (this.props.state.user.login.currentlyLoggedIn && !this.state.rateLimitedAuthed) ||
      (!this.props.state.user.login.currentlyLoggedIn && !this.state.rateLimitedUnauthed)
    )) {
      window.sessionStorage.setItem(`rateLimits_${this.props.id}_disableRateLimit`, 'true');
    }
  }

  render() {
    const { state, bypassLimiter, renderLimitedContent, children } = this.props;
    const rateLimited = state.user.login.currentlyLoggedIn
      ? this.state.rateLimitedAuthed
      : this.state.rateLimitedUnauthed;

    if (!rateLimited || this.state.disableRateLimit || bypassLimiter(state)) {
      return children;
    }

    return renderLimitedContent(state);
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(RateLimiter);
