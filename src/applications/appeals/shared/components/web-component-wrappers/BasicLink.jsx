import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Use this component when you need a react-router <Link> that is also a
// va-link web component from the Design System Library
// https://design.va.gov/storybook/?path=/docs/components-va-link--docs
const BasicLink = ({ path, search, router, ...props }) => {
  const ariaLabel = props?.['aria-label'] ?? {};
  const href = path.charAt(0) === '/' ? path : `/${path}`;

  return (
    <VaLink
      {...props}
      href={href}
      label={ariaLabel}
      onClick={event => {
        event.preventDefault();

        if (search && path) {
          router.push(`${path}${search}`);
        } else if (path) {
          router.push(path);
        }
      }}
    />
  );
};

BasicLink.propTypes = {
  'aria-label': PropTypes.string,
  path: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  search: PropTypes.string,
  onClick: PropTypes.func,
};

export default withRouter(BasicLink);
