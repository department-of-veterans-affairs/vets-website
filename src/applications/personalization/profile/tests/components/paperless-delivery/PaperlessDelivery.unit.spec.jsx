import React from 'react';
import { cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  mockFetch,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';
import * as useNotificationSettingsUtils from '@@profile/hooks/useNotificationSettingsUtils';
import { PaperlessDelivery } from '../../../components/paperless-delivery/PaperlessDelivery';
import { LOADING_STATES } from '../../../../common/constants';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

// Helper function to provide base Redux state
const getBaseInitialState = (overrides = {}) => ({
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: { get() {} },
    dismissedDowntimeWarnings: [],
  },
  communicationPreferences: {
    loadingStatus: LOADING_STATES.loaded,
    loadingErrors: null,
    groups: {
      ids: [],
      entities: {},
    },
    items: {
      ids: [],
      entities: {},
    },
    channels: {
      ids: [],
      entities: {},
    },
  },
  ...overrides,
});

describe('PaperlessDelivery', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockFetch();
    setFetchJSONResponse(global.fetch.onFirstCall(), {
      data: {
        type: 'hashes',
        id: '',
        attributes: {
          communicationGroups: [],
        },
      },
    });
    sandbox
      .stub(useNotificationSettingsUtils, 'useNotificationSettingsUtils')
      .returns({
        usePaperlessDeliveryGroup: () => [],
      });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('should render loading indicator', () => {
    const { container } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          communicationPreferences: {
            loadingStatus: LOADING_STATES.pending,
            loadingErrors: null,
            groups: { ids: [], entities: {} },
            items: { ids: [], entities: {} },
            channels: { ids: [], entities: {} },
          },
        }),
      },
    );
    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it('should render the heading', () => {
    const { getByRole } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState(),
      },
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Paperless delivery');
  });

  it('should render the description', async () => {
    const { container } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          user: {
            profile: {
              vapContactInfo: {},
            },
          },
        }),
      },
    );
    await waitFor(() => {
      const text = container.textContent;
      expect(text).to.include('With paperless delivery');
      expect(text).to.include('choose which documents you');
    });
  });

  it('should render the note', async () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState(),
      },
    );
    await waitFor(() => {
      expect(
        getByText(
          /We have limited documents available for paperless delivery at this time/,
        ),
      ).to.exist;
    });
  });

  it('should not render missing email alert when user has an email address', () => {
    const { queryByText } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          user: {
            profile: {
              vapContactInfo: {
                email: {
                  emailAddress: 'alongusername@me.com',
                },
              },
            },
          },
        }),
      },
    );
    expect(
      queryByText(/Add your email to get notified when documents are ready/),
    ).not.to.exist;
  });

  it('should render email and update email address link when user has an email address', async () => {
    const { getByText, getByRole } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          user: {
            profile: {
              vapContactInfo: {
                email: {
                  emailAddress: 'alongusername@me.com',
                },
              },
            },
          },
        }),
      },
    );
    await waitFor(() => {
      expect(getByText(/alongusername@me.com/)).to.exist;
      expect(getByRole('link', { name: /Update your email address/ })).to.exist;
    });
  });

  it('should render missing email alert when user has no email address', async () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          user: {
            profile: {
              vapContactInfo: {},
            },
          },
        }),
      },
    );
    await waitFor(() => {
      expect(
        getByText(/Add your email to get notified when documents are ready/),
      ).to.exist;
    });
  });

  it('should render add email address link when user has no email address', async () => {
    const { getByRole } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          user: {
            profile: {
              vapContactInfo: {},
            },
          },
        }),
      },
    );
    await waitFor(() => {
      expect(
        getByRole('link', { name: /Add your email address to your profile/ }),
      ).to.exist;
    });
  });

  it('should render alert on api error', () => {
    const { container } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          communicationPreferences: {
            loadingStatus: LOADING_STATES.error,
            loadingErrors: {},
            groups: { ids: [], entities: {} },
            items: { ids: [], entities: {} },
            channels: { ids: [], entities: {} },
          },
        }),
      },
    );
    const alert = container.querySelector('va-alert[status="warning"]');
    expect(alert).to.exist;
  });

  it('should render downtime maintenance alert', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
        initialState: getBaseInitialState({
          scheduledDowntime: {
            globalDowntime: true,
            isReady: true,
            isPending: false,
            serviceMap: { get() {} },
            dismissedDowntimeWarnings: [],
          },
        }),
      },
    );
    expect(getByText(/This tool is down for maintenance/)).to.exist;
  });
});
