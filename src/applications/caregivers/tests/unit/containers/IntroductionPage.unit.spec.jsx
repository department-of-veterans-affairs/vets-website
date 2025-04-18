import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import IntroductionPage from '../../../containers/IntroductionPage';
import formConfig from '../../../config/form';
import content from '../../../locales/en/content.json';

describe('CG <IntroductionPage>', () => {
  const subject = ({ routerSpy = () => {} } = {}) => {
    const props = {
      route: {
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
      router: { push: routerSpy },
    };
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

  context('when the page renders', () => {
    it('should contain the correct page title and introduction', () => {
      const { selectors } = subject();
      const { intro, title, wrapper } = selectors();
      expect(wrapper).to.not.be.empty;
      expect(title).to.contain.text(content['app-title']);
      expect(intro).to.contain.text(content['app-intro']);
    });

    it('should contain links to start the application', () => {
      const { selectors } = subject();
      expect(selectors().startBtns).to.have.lengthOf(2);
    });

    it('should contain the process timeline for steps to get started with the application', () => {
      const { selectors } = subject();
      expect(selectors().vaProcessList).to.exist;
    });

    it('should contain the OMB info for this application', () => {
      const { selectors } = subject();
      const { vaOmbInfo } = selectors();
      expect(vaOmbInfo).to.exist;
      expect(vaOmbInfo).to.have.attribute('res-burden');
      expect(vaOmbInfo).to.have.attribute('omb-number');
      expect(vaOmbInfo).to.have.attribute('exp-date');
    });
  });

  context('when the `start` button is clicked', () => {
    let recordEventStub;

    beforeEach(() => {
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      recordEventStub.restore();
    });

    it('should call the `recordEvent` helper to send the `start` event to Google Analytics', () => {
      const { selectors } = subject();
      const { startBtns } = selectors();
      const expectedEvent = { event: 'caregivers-10-10cg-start-form' };
      fireEvent.click(startBtns[0]);
      expect(recordEventStub.calledWith(expectedEvent)).to.be.true;
    });

    it('should call the routers `push` event with the correct page path', () => {
      const routerSpy = sinon.spy();
      const { selectors } = subject({ routerSpy });
      const { startBtns } = selectors();
      fireEvent.click(startBtns[0]);
      expect(routerSpy.calledWith('/next')).to.be.true;
    });
  });
});
