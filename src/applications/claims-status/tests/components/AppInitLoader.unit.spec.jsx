import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AppInitLoader from '../../components/AppInitLoader';

describe('AppInitLoader', () => {
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

    const { container, queryByText } = render(
      <Provider store={mockStore}>
        <AppInitLoader>
          <div>Child content</div>
        </AppInitLoader>
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.equal(
      'Loading VA Claim Status...',
    );
    expect(queryByText('Child content')).to.not.exist;
  });

  it('should render children when downtime check is ready', () => {
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

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <AppInitLoader>
          <div>Child content</div>
        </AppInitLoader>
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.not.exist;
    expect(getByText('Child content')).to.exist;
  });
});
