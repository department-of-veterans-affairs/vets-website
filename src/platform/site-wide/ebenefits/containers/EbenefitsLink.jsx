import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

import { shouldUseProxyUrl } from '../selectors';
import { proxyUrl, defaultUrl } from '../utilities';

const EbenefitsLink = props => {
  const url = props.useProxyUrl ? proxyUrl : defaultUrl;
  const click = () =>
    props.isLoggedIn && recordEvent({ event: 'nav-ebenefits-click' });
  const attrs = {
    href: props.href || url(props.path),
    className: props.className || '',
    target: props.target || '_blank',
    rel: props.rel || 'noopener noreferrer',
    onClick: props.onClick || click,
  };
  return <a {...attrs}>{props.children}</a>;
};

EbenefitsLink.propTypes = {
  path: PropTypes.string,
};

const mapStateToProps = state => ({
  isLoggedIn: isLoggedInSelector(state),
  useProxyUrl: shouldUseProxyUrl(state),
});

export default connect(mapStateToProps)(EbenefitsLink);

export { EbenefitsLink };
