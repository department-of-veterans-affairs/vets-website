import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Servers } from './app/pages/servers/Servers';

import { VADXProvider } from './context/vadx';
import { VADXPanelLoader } from './panel/VADXPanelLoader';

export const VADX = ({ children, plugin, featureToggleName = null }) => {
  return (
    <>
      <Suspense
        fallback={
          <va-loading-indicator
            label="Loading"
            message="Loading your application..."
            set-focus
          />
        }
      >
        {children}
        <VADXProvider>
          <VADXPanelLoader
            plugin={plugin}
            featureToggleName={featureToggleName}
          />
        </VADXProvider>
      </Suspense>
    </>
  );
};

VADX.propTypes = {
  children: PropTypes.node.isRequired,
  featureToggleName: PropTypes.string,
  plugin: PropTypes.object,
};

export { Servers as VADXServersRoute };
