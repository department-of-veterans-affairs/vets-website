import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import WrappedIntroductionPage from 'applications/accreditation/21a/containers/IntroductionPage';

import { selectUserIsLoggedIn } from '../../../selectors/user';
import { SIGN_IN_URL } from '../../../constants';

const SIGN_IN_LINK_PROPS = {
  onClick: undefined,
  href: SIGN_IN_URL,
};

function StartLink({ children, ...props }) {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  return (
    <a
      className="usa-button usa-button-primary"
      {...props}
      {...isLoggedIn || SIGN_IN_LINK_PROPS}
    >
      {children}
    </a>
  );
}

function IntroductionPage(props) {
  return <WrappedIntroductionPage startLink={StartLink} {...props} />;
}

StartLink.propTypes = {
  children: PropTypes.node,
};

export default IntroductionPage;
