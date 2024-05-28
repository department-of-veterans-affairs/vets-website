import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import HeaderLayout from '../../components/HeaderLayout';

const mockStore = ({
  mhvLandingPageEnableVaGovHealthToolsLinks = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
      mhvLandingPageEnableVaGovHealthToolsLinks,
      // eslint-disable-next-line camelcase
      mhv_landing_page_enable_va_gov_health_tools_links: mhvLandingPageEnableVaGovHealthToolsLinks,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('MHV Landing Page -- Header Layout', () => {
  describe('Health Tools links -- feature toggle enabled', () => {
    it('shows the new content when mhvLandingPageEnableVaGovHealthToolsLinks is true', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: true,
      });
      const { getByText } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );
      const result = getByText(/Welcome to the new home for My HealtheVet/);
      expect(result).to.exist;
    });
  });

  describe('Health Tools links -- feature toggle disabled', () => {
    it('shows the old content when mhvLandingPageEnableVaGovHealthToolsLinks is false', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: false,
      });
      const { getByText } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );
      const result = getByText(/Learn more about My HealtheVet on VA.gov/);
      expect(result).to.exist;
    });
  });
});
