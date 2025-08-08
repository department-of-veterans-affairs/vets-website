import React from 'react';
import * as redux from 'react-redux';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderWithStoreAndRouter as render } from '~/platform/testing/unit/react-testing-library-helpers';
import * as useNotificationSettingsUtils from '@@profile/hooks/useNotificationSettingsUtils';
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
    const { getByText } = render(<PaperlessDelivery />, {});
    expect(
      getByText(
        /With paperless delivery, you can choose which documents you no longer want to get by mail./,
      ),
    ).to.exist;
  });

  it('should render the note', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    const { getByText } = render(<PaperlessDelivery />, {});
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
    expect(queryByText(/Add your email to get delivery updates/)).not.to.exist;
  });

  it('should render email and update email address link when user has an email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = 'alongusername@me.com';
    const { getByText, getByRole } = render(<PaperlessDelivery />, {});
    expect(getByText(/alongusername@me.com/)).to.exist;
    expect(getByRole('link', { name: /Update your email address/ })).to.exist;
  });

  it('should render missing email alert when user has no email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = null;
    const { getByText } = render(<PaperlessDelivery />, {});
    expect(getByText(/Add your email to get delivery updates/)).to.exist;
  });

  it('should render add email address link when user has no email address', () => {
    mockSelectCommunicationPreferences = {
      loadingStatus: LOADING_STATES.loaded,
      loadingErrors: null,
    };
    emailAddress = null;
    const { getByRole } = render(<PaperlessDelivery />, {});
    expect(
      getByRole('link', { name: /Add your email address to your profile/ }),
    ).to.exist;
  });
});
