import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon-v20';
import * as recordEventModule from 'platform/monitoring/record-event';
import IntroductionPage from '../../../containers/IntroductionPage';
import formConfig from '../../../config/form';

describe('CG <IntroductionPage>', () => {
  let routerSpy;
  const mockStore = {
    getState: () => ({
      form: {
        formId: formConfig.formId,
        data: {},
        loadedData: { metadata: {} },
        lastSavedDate: null,
        migrations: [],
      },
      user: {
        login: {
          currentlyLoggedIn: false,
        },
        profile: {
          loading: false,
          loa: { current: null },
          savedForms: [],
          prefillsAvailable: [],
        },
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get: () => {} },
        dismissedDowntimeWarnings: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const subject = () => {
    const props = {
      route: {
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
      router: { push: routerSpy },
    };
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      wrapper: container.querySelector('.caregivers-intro'),
      title: container.querySelector('[data-testid="form-title"]'),
      intro: container.querySelector('.va-introtext'),
      startBtns: container.querySelectorAll('[href="#start"]'),
      vaOmbInfo: container.querySelector('va-omb-info'),
      vaProcessList: container.querySelector('va-process-list'),
    });
    return { selectors };
  };
  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
    routerSpy = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call the `recordEvent` helper to send the `start` event to Google Analytics', () => {
    const { selectors } = subject();
    const { startBtns } = selectors();
    const expectedEvent = { event: 'caregivers-10-10cg-start-form' };
    fireEvent.click(startBtns[0]);
    sinon.assert.calledWithExactly(recordEventStub, expectedEvent);
  });

  it('should call the routers `push` event with the correct page path', () => {
    const { selectors } = subject();
    const { startBtns } = selectors();
    fireEvent.click(startBtns[0]);
    sinon.assert.calledWithExactly(routerSpy, '/next');
  });
});
