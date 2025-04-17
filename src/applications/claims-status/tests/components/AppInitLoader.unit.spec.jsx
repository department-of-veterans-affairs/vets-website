import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AppInitLoader from '../../components/AppInitLoader';

describe('AppInitLoader', () => {
  it('should render the spinner when loading feature toggles', () => {
    const mockStore = configureStore({
      reducer: () => ({
        featureToggles: {
          loading: true,
        },
        scheduledDowntime: {
          isReady: true,
        },
      }),
    });

    render(
      <Provider store={mockStore}>
        <AppInitLoader>
          <div>Child content</div>
        </AppInitLoader>
      </Provider>,
    );

    expect(screen.getByText('Loading VA Claim Status...')).to.exist;
    expect(screen.queryByText('Child content')).to.not.exist;
  });

  it('should render the spinner when downtime check is loading', () => {
    const mockStore = configureStore({
      reducer: () => ({
        featureToggles: {
          loading: false,
        },
        scheduledDowntime: {
          isReady: false,
        },
      }),
    });

    render(
      <Provider store={mockStore}>
        <AppInitLoader>
          <div>Child content</div>
        </AppInitLoader>
      </Provider>,
    );

    expect(screen.getByText('Loading VA Claim Status...')).to.exist;
    expect(screen.queryByText('Child content')).to.not.exist;
  });

  it('should render children when not loading', () => {
    const mockStore = configureStore({
      reducer: () => ({
        featureToggles: {
          loading: false,
        },
        scheduledDowntime: {
          isReady: true,
        },
      }),
    });

    render(
      <Provider store={mockStore}>
        <AppInitLoader>
          <div>Child content</div>
        </AppInitLoader>
      </Provider>,
    );

    expect(screen.queryByText('Loading VA Claim Status...')).to.not.exist;
    expect(screen.getByText('Child content')).to.exist;
  });
});
