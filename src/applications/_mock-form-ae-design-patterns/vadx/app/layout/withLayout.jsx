import React from 'react';
import { MainLayout } from './MainLayout';
import { Navigation } from './Navigation';

export const withLayout = Component => props => {
  return (
    <MainLayout navigation={<Navigation />}>
      <Component {...props} />
    </MainLayout>
  );
};
