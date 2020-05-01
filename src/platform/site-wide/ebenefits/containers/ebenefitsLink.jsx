import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLoggedIn } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

import { shouldUseProxyUrl } from '../selectors';
import { proxyUrl, defaultUrl } from '../utilities';

class ebenefitsLink extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    emitEvent: PropTypes.bool,
  };
  static defaultProps = {
    path: '',
    emitEvent: true,
  };

  render() {
    const url = this.props.useProxyUrl ? proxyUrl : defaultUrl;
    const defaults = {
      href: url(this.props.path),
      target: '_blank',
      rel: 'noopener noreferrer',
      onClick: () =>
        this.props.emitEvent &&
        isLoggedIn &&
        recordEvent({ event: 'nav-ebenefits-click' }),
    };
    const data = { ...defaults, ...this.props };

    return <a {...data}>{this.props.children}</a>;
  }
}

const mapStateToProps = state => ({
  useProxyUrl: shouldUseProxyUrl(state),
});

export default connect(mapStateToProps)(ebenefitsLink);

export { ebenefitsLink };
