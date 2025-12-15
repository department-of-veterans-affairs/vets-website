import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ActionLink = ({ path, router, primary, onClick, ...props }) => {
  const href = path?.charAt(0) === '/' ? path : `/${path}`;

  return (
    <VaLinkAction
      {...props}
      href={href}
      onClick={event => {
        event.preventDefault();

        if (onClick) {
          onClick(event);
        }

        if (path && router) {
          router.push(path);
        }
      }}
      type={primary ? 'primary' : 'secondary'}
    />
  );
};

ActionLink.propTypes = {
  path: PropTypes.string,
  primary: PropTypes.bool,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  onClick: PropTypes.func,
};

export default withRouter(ActionLink);
