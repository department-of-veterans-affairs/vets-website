import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
<<<<<<< HEAD

=======
>>>>>>> main
import * as recordEventModule from 'platform/monitoring/record-event';
import IntroductionPage from '../../../containers/IntroductionPage';
import formConfig from '../../../config/form';
import content from '../../../locales/en/content.json';

describe('CG <IntroductionPage>', () => {
<<<<<<< HEAD
  const getData = () => ({
    props: {
      route: {
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
      router: {
        push: sinon.spy(),
      },
    },
    mockStore: {
=======
  const subject = ({ routerSpy = () => {} } = {}) => {
    const props = {
      route: {
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
      router: { push: routerSpy },
    };
    const mockStore = {
>>>>>>> main
      getState: () => ({
        form: {
          formId: formConfig.formId,
          data: {},
<<<<<<< HEAD
          loadedData: {
            metadata: {},
          },
=======
          loadedData: { metadata: {} },
>>>>>>> main
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
<<<<<<< HEAD
          serviceMap: {
            get: () => {},
          },
=======
          serviceMap: { get: () => {} },
>>>>>>> main
          dismissedDowntimeWarnings: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
<<<<<<< HEAD
    },
  });
  const subject = ({ mockStore, props }) =>
    render(
=======
    };
    const { container } = render(
>>>>>>> main
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
<<<<<<< HEAD

  context('when the page renders', () => {
    it('should contain the correct page title and introduction', () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selectors = {
        wrapper: container.querySelector('.caregivers-intro'),
        title: container.querySelector('[data-testid="form-title"]'),
        intro: container.querySelector('.va-introtext'),
      };
      expect(selectors.wrapper).to.not.be.empty;
      expect(selectors.title).to.contain.text(content['app-title']);
      expect(selectors.intro).to.contain.text(content['app-intro']);
    });

    it('should contain links to start the application', () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selector = container.querySelectorAll('[href="#start"]');
      expect(selector).to.have.lengthOf(2);
    });

    it('should contain the process timeline for steps to get started with the application', () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selector = container.querySelector('va-process-list');
      expect(selector).to.exist;
    });

    it('should contain the OMB info for this application', () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selector = container.querySelector('va-omb-info');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('res-burden');
      expect(selector).to.have.attribute('omb-number');
      expect(selector).to.have.attribute('exp-date');
=======
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
>>>>>>> main
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
<<<<<<< HEAD
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selector = container.querySelector('.vads-c-action-link--green');

      fireEvent.click(selector);
      expect(
        recordEventStub.calledWith({
          event: 'caregivers-10-10cg-start-form',
        }),
      ).to.be.true;
    });

    it('should call the routers `push` event with the correct page path', () => {
      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });
      const selector = container.querySelector('.vads-c-action-link--green');

      fireEvent.click(selector);
      expect(props.router.push.calledWith('/next')).to.be.true;
=======
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
>>>>>>> main
    });
  });
});
