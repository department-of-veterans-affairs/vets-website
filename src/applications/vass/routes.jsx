import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom-v5-compat';

import withAuthorization from './containers/withAuthorization';
import withFormData from './containers/withFormData';
import { routes } from './utils/navigation';
import { AUTH_LEVELS } from './utils/constants';

const createRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        // Wrap protected routes with appropriate HOC
        let Component = route.component;
        const { requiresAuthorization, requireFormData } = route.permissions;

        if (
          requiresAuthorization === AUTH_LEVELS.TOKEN ||
          requiresAuthorization === AUTH_LEVELS.LOW_AUTH_ONLY
        ) {
          // Wrap with authorization HOC, passing the auth level
          Component = withAuthorization(route.component, requiresAuthorization);
        }
        if (requireFormData) {
          // Routes requiring specific form data fields
          Component = withFormData(
            route.component,
            Array.isArray(requireFormData) ? requireFormData : [],
          );
        }

        return <Route key={index} path={route.path} element={<Component />} />;
      })}
      {/* TODO: navigate to error page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default createRoutes();
