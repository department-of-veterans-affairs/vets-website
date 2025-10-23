import React from 'react';
import * as redux from 'react-redux';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderWithStoreAndRouter as render } from '~/platform/testing/unit/react-testing-library-helpers';
import * as useNotificationSettingsUtils from '@@profile/hooks/useNotificationSettingsUtils';
import * as recordEventModule from '~/platform/monitoring/record-event';
import {
  selectVAPEmailAddress,
  hasVAPServiceConnectionError,
} from '~/platform/user/selectors';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import { selectCommunicationPreferences } from '@@profile/reducers';
import { PaperlessDelivery } from '../../../components/paperless-delivery/PaperlessDelivery';
import { LOADING_STATES } from '../../../../common/constants';

describe('PaperlessDelivery', () => {
  let sandbox;
  let emailAddress;
  let mockSelectCommunicationPreferences;
  let recordEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(redux, 'useDispatch').returns(() => {});
    sandbox
      .stub(useNotificationSettingsUtils, 'useNotificationSettingsUtils')
      .returns({
        usePaperlessDeliveryGroup: () => [],
      });
    sandbox.stub(redux, 'useSelector').callsFake(selector => {
      switch (selector) {
        case selectVAPEmailAddress:
          return emailAddress;
        case selectPatientFacilities:
          return [];
        case selectCommunicationPreferences:
          return mockSelectCommunicationPreferences;
        case hasVAPServiceConnectionError:
          return false;
        default:
          return undefined;
      }
    });
    recordEventStub = sandbox.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('should render loading indicator', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.pending,
      loadingErrors: null,
    };
    const { container } = render(<PaperlessDelivery />, {});
    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it('should render the heading', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    const { getByRole } = render(<PaperlessDelivery />, {});
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Paperless delivery');
  });

  it('should render the description', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(
      getByText(
        /With paperless delivery, you can choose which documents you don’t want to get by mail./,
      ),
    ).to.exist;
  });

  it('should render the note', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(
      getByText(
        /We have limited documents available for paperless delivery at this time/,
      ),
    ).to.exist;
  });

  it('should not render missing email alert when user has an email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = 'alongusername@me.com';
    const { queryByText } = render(<PaperlessDelivery />, {});
    expect(
      queryByText(/Add your email to get notified when documents are ready/),
    ).not.to.exist;
  });

  it('should render email and update email address link when user has an email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = 'alongusername@me.com';
    const { getByText, getByRole } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(getByText(/alongusername@me.com/)).to.exist;
    expect(getByRole('link', { name: /Update your email address/ })).to.exist;
  });

  it('should render missing email alert when user has no email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = null;
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(getByText(/Add your email to get notified when documents are ready/))
      .to.exist;
    const missingEmailEvent = {
      event: 'visible-alert-box',
      'alert-box-type': 'info',
      'alert-box-heading':
        'Add your email to get notified when documents are ready',
      'error-key': 'missing_email',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'Missing email',
    };
    sinon.assert.calledWithExactly(recordEventStub, missingEmailEvent);
  });

  it('should render add email address link when user has no email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = null;
    const { getByRole } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(
      getByRole('link', { name: /Add your email address to your profile/ }),
    ).to.exist;
  });

  it('should render alert on api error', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.error,
      loadingErrors: {},
    };
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(getByText(/This page isn’t available right now/)).to.exist;
    const apiErrorEvent = {
      event: 'visible-alert-box',
      'alert-box-type': 'warning',
      'alert-box-heading': 'This page isn’t available right now',
      'error-key': 'api_error',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'API error',
    };
    sinon.assert.calledWithExactly(recordEventStub, apiErrorEvent);
  });

  it('should render downtime maintenance alert', () => {
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: true,
          isReady: true,
          isPending: false,
          serviceMap: { get() {} },
          dismissedDowntimeWarnings: [],
        },
      },
    });
    expect(getByText(/This tool is down for maintenance/)).to.exist;
  });
});
