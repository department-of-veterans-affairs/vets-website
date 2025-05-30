import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Use this component when you need a react-router <Link> that is also a
// va-link-action web component from the Design System Library
// https://design.va.gov/storybook/?path=/docs/components-va-link-action--docs
const ActionLink = ({ path, search, onClick, primary, router, ...props }) => {
  const ariaLabel = props?.['aria-label'] ?? {};

  return (
    <VaLinkAction
      label={ariaLabel}
      {...props}
      onClick={() => {
        if (onClick) {
          onClick();
        }

        if (search && path) {
          router.push(`${path}${search}`);
        } else if (path) {
          router.push(path);
        }
      }}
      type={primary ? 'primary' : 'secondary'}
    />
  );
};

ActionLink.propTypes = {
  primary: PropTypes.bool.isRequired,
  'aria-label': PropTypes.string,
  path: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  search: PropTypes.string,
  onClick: PropTypes.func,
};

export default withRouter(ActionLink);
