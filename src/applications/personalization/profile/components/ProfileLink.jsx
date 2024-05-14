import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { PROFILE_PATHS } from '../constants';
import { normalizePath } from '../../common/helpers';

const linkAndAnchorStyles = `
i {
  &:before {
    content: '\f105';
    display: inline-block;
    margin-bottom: 0.1rem;
    margin-left: 0.8rem;
    margin-right: 0;
    vertical-align: middle;
    moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: 'Font Awesome 5 Free';
    font-size: 1.6rem;
    font-style: normal;
    font-variant: normal;
    font-weight: 900;
    line-height: 1;
    text-rendering: auto;
  }
}

&:hover,
&:focus {
  i {
    &:before {
      margin-left: 1.2rem;
      transition-duration: 0.3s;
      transition-timing-function: ease-in-out;
      transition-property: margin;
    }
  }
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
      {active && <i />}
    </StyledRouterLink>
  ) : (
    <StyledAnchor
      href={href}
      className={`${classes}`}
      data-testid="profile-link-external"
    >
      {text}
      {active && <i />}
    </StyledAnchor>
  );
};

ProfileLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
};
