import React from 'react';
import { Navigate } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { Toggler } from '~/platform/utilities/feature-toggles';

const redirect = <Navigate to="../status" replace />;

export default function TogglerRoute({
  children,
  redirectWhenToggleEnabled = false,
  toggleName,
}) {
  if (redirectWhenToggleEnabled) {
    return (
      <Toggler toggleName={toggleName}>
        <Toggler.Enabled>{redirect}</Toggler.Enabled>
        <Toggler.Disabled>{children}</Toggler.Disabled>
      </Toggler>
    );
  }

  return (
    <Toggler toggleName={toggleName}>
      <Toggler.Enabled>{children}</Toggler.Enabled>
      <Toggler.Disabled>{redirect}</Toggler.Disabled>
    </Toggler>
  );
}

TogglerRoute.propTypes = {
  children: PropTypes.node.isRequired,
  toggleName: PropTypes.string.isRequired,
  redirectWhenToggleEnabled: PropTypes.bool,
};
