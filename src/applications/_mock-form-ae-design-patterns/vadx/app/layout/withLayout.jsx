import React from 'react';
import { MainLayout } from './MainLayout';
import { Navigation } from './Navigation';
import { ProcessManagerProvider } from '../../context/processManager';

// withLayout is a higher order component that wraps the component with the ProcessManagerProvider
// and MainLayout so that it can be used in the react router routes config
export const withLayout = Component => props => {
  return (
    <ProcessManagerProvider>
      <MainLayout navigation={<Navigation />}>
        <Component {...props} />
      </MainLayout>
    </ProcessManagerProvider>
  );
};
