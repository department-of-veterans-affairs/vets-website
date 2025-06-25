import React from 'react';
import { CodespaceProvider } from './CodespaceProvider';
import { VADX } from './vadx';

// Higher order component to wrap routes in the PatternConfigProvider and other common components
export const CodespaceRouteHoc = ({
  Component,
  tabsConfig,
  plugin,
  featureToggleName,
}) => props => (
  <CodespaceProvider tabsConfig={tabsConfig} {...props}>
    <VADX plugin={plugin || null} featureToggleName={featureToggleName}>
      <Component {...props} />
    </VADX>
  </CodespaceProvider>
);
