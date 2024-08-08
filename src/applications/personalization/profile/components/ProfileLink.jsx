import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { PROFILE_PATHS } from '../constants';
import { normalizePath } from '../../common/helpers';

const linkAndAnchorStyles = `
va-icon {
  vertical-align: middle;
  position: relative;
  top: -1px;
}
`;

// sets up same styles for icon as va-link with active prop
const StyledRouterLink = styled(Link)`
  ${linkAndAnchorStyles};
`;

const StyledAnchor = styled.a`
  ${linkAndAnchorStyles};
`;

export const ProfileLink = ({ href, active = true, className = '', text }) => {
  const path = normalizePath(href);

  const isProfilePath = Object.values(PROFILE_PATHS).includes(path);

  const classes = classNames(className, {
    'vads-u-font-weight--bold': active,
  });

  return isProfilePath ? (
    <StyledRouterLink
      className={classes}
      to={path}
      data-testid="profile-link-internal"
    >
      {text}
      {active && <va-icon icon="chevron_right" size={2} />}
    </StyledRouterLink>
  ) : (
    <StyledAnchor
      href={href}
      className={`${classes}`}
      data-testid="profile-link-external"
    >
      {text}
      {active && <va-icon icon="chevron_right" size={2} />}
    </StyledAnchor>
  );
};

ProfileLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
};
