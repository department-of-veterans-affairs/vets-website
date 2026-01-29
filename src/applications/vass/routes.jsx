import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom-v5-compat';

import withAuthorization from './containers/withAuthorization';
import withFormData from './containers/withFormData';
import withFlowGuard from './containers/withFlowGuard';
import { routes } from './utils/navigation';
import { AUTH_LEVELS, FLOW_TYPES } from './utils/constants';

const createRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        // Wrap protected routes with appropriate HOC
        let Component = route.component;
        const { requiresAuthorization, requireFormData } = route.permissions;

        // 1. Apply authorization HOC first (checks token/auth level)
        if (
          requiresAuthorization === AUTH_LEVELS.TOKEN ||
          requiresAuthorization === AUTH_LEVELS.LOW_AUTH_ONLY
        ) {
          Component = withAuthorization(Component, requiresAuthorization);
        }

        // 2. Apply form data requirements
        if (requireFormData) {
          Component = withFormData(
            Component,
            Array.isArray(requireFormData) ? requireFormData : [],
          );
        }

        // 3. Apply flow guard (prevents switching between schedule/cancel flows)
        if (route.flowType && route.flowType !== FLOW_TYPES.ANY) {
          Component = withFlowGuard(Component, route.flowType);
        }

        return <Route key={index} path={route.path} element={<Component />} />;
      })}
      {/* TODO: navigate to error page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default createRoutes();
