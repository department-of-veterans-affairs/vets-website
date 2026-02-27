import React from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';

export default function App({ params }) {
  const { id } = params;
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.dependentsEnableFormViewerMFE}>
      <Toggler.Enabled>{id}</Toggler.Enabled>
      <Toggler.Disabled>
        {/* If the feature flag is off, redirect user to /my-va */}
        <RedirectHandler />
      </Toggler.Disabled>
    </Toggler>
  );
}

const RedirectHandler = () => {
  window.location.href = '/my-va';

  return (
    <div>
      <va-loading-indicator label="Loading" message="Redirecting..." />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
