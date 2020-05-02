import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLoggedIn } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

import { shouldUseProxyUrl } from '../selectors';
import { proxyUrl, defaultUrl } from '../utilities';

class EbenefitsLink extends React.Component {
  static propTypes = {
    path: PropTypes.string,
  };
  static defaultProps = {
    path: '',
  };

  render() {
    const url = this.props.useProxyUrl ? proxyUrl : defaultUrl;
    const click = () =>
      isLoggedIn && recordEvent({ event: 'nav-ebenefits-click' });
    const attrs = {
      href: this.props.href || url(this.props.path),
      className: this.props.className || '',
      target: this.props.target || '_blank',
      rel: this.props.rel || 'noopener noreferrer',
      onClick: this.props.onClick || click,
    };

    return <a {...attrs}>{this.props.children}</a>;
  }
}

const mapStateToProps = state => ({
  useProxyUrl: shouldUseProxyUrl(state),
});

export default connect(mapStateToProps)(EbenefitsLink);

export { EbenefitsLink };
