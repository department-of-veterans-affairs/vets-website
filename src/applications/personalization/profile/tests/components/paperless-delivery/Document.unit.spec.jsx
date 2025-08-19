// Document.test.jsx
import React from 'react';
import * as redux from 'react-redux';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from '~/platform/monitoring/record-event';
import { Document } from '../../../components/paperless-delivery/Document';
import { LOADING_STATES } from '../../../../common/constants';

describe('Document', () => {
  let sandbox;
  let clock;
  let dispatchStub;
  let useSelectorStub;
  let recordEventSpy;

  const item = {
    name: '1095-B Proof of Health Care',
    channels: ['channel15-3'],
  };
  const channel = {
    channelType: 'email',
    defaultSendIndicator: false,
    isAllowed: true,
    parentItem: 'item15',
    permissionId: null,
    ui: { updateStatus: null },
  };
  const baseState = {
    communicationPreferences: {
      items: {
        entities: {
          item15: item,
        },
      },
      channels: {
        entities: {
          'channel15-3': channel,
        },
      },
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sandbox.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
    dispatchStub = sandbox.stub();
    sandbox.stub(redux, 'useDispatch').returns(dispatchStub);
    useSelectorStub = sandbox.stub(redux, 'useSelector');
    useSelectorStub.onCall(0).returns(item);
    useSelectorStub.onCall(1).returns(channel);
    recordEventSpy = sandbox.spy(recordEventModule, 'default');
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
    cleanup();
  });

  it('renders the checkbox with checked when isAllowed is true and updateStatus is null', () => {
    const { container } = render(<Document document="item15" />);
    const checkbox = container.querySelector(
      'va-checkbox[label="1095-B Proof of Health Care"]',
    );
    expect(checkbox.checked).to.be.true;
  });

  it('renders LoadingButton and hides checkbox when updateStatus is pending', () => {
    useSelectorStub.onCall(1).returns({
      ...baseState.communicationPreferences.channels.entities['channel15-3'],
      ui: { updateStatus: LOADING_STATES.pending },
    });
    const { container } = render(<Document document="item15" />);
    const loadingButton = container.querySelector('va-button');
    expect(loadingButton).to.exist;
    const checkbox = container.querySelector(
      'va-checkbox[label="1095-B Proof of Health Care"]',
    );
    expect(checkbox.className).to.include('vads-u-display--none');
    expect(checkbox.disabled).to.be.true;
  });

  it('renders alert when updateStatus has error', () => {
    useSelectorStub.onCall(1).returns({
      ...baseState.communicationPreferences.channels.entities['channel15-3'],
      ui: { updateStatus: LOADING_STATES.error },
    });

    const { container } = render(<Document document="item15" />);
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
  });

  it('does nothing if newValue === isAllowed', () => {
    useSelectorStub.onCall(1).returns({
      ...baseState.communicationPreferences.channels.entities['channel15-3'],
      ui: { updateStatus: LOADING_STATES.loaded },
      isAllowed: false,
      defaultSendIndicator: false,
    });
    const { container } = render(<Document document="item15" />);
    const checkbox = container.querySelector(
      'va-checkbox[label="1095-B Proof of Health Care"]',
    );
    fireEvent(
      checkbox,
      new CustomEvent('vaChange', {
        detail: { checked: false },
        bubbles: true,
        composed: true,
      }),
    );
    expect(dispatchStub.notCalled).to.be.true;
    expect(recordEventSpy.notCalled).to.be.true;
  });
});
