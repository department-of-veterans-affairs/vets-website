import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import i18n from '../../../utils/i18n/i18n';
import NextOfKin from '../NextOfKin';

import { createMockRouter } from '../../../tests/unit/mocks/router';

describe('check in', () => {
  describe('Next of Kin', () => {
    let store;
    const initState = {
      checkInData: {
        context: {
          token: '',
        },
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          currentPage: 'first-page',
        },
        veteranData: {
          demographics: {
            nextOfKin1: {
              address: {
                street1: '445 Fine Finch Fairway',
                street2: 'Apt 201',
                city: 'Fairfence',
                state: 'Florida',
                zip: '445545',
              },
              name: 'Kin, Next',
              relationship: 'child',
              phone: '5553334444',
              workPhone: '5554445555',
            },
          },
        },
      },
      ...scheduledDowntimeState,
    };
    const middleware = [];
    const mockStore = configureStore(middleware);
    const routerObject = {
      params: {
        token: 'token-123',
      },
      location: {
        pathname: '/first-page',
      },
    };
    beforeEach(() => {
      store = mockStore(initState);
    });

    it('renders', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      const component = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.queryByText('Not available')).to.be.null;
    });

    it('shows "Not available" for unavailable fields', () => {
      const updatedStore = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
          veteranData: {
            demographics: {
              nextOfKin1: {
                ...initState.checkInData.veteranData.demographics.nextOfKin1,
                name: '',
                relationship: '',
                workPhone: '',
              },
            },
          },
        },
        ...scheduledDowntimeState,
      };
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      const component = render(
        <Provider store={mockStore(updatedStore)}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('555-333-4444')).to.exist;
      expect(component.queryByText('Kin, Next')).to.be.null;
      expect(component.queryByText('5554445555')).to.be.null;
      expect(component.getAllByText('Not available')).to.exist;
    });

    it('passes axeCheck', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );
    });

    it('has a clickable no button', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      const component = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('no-button').click();
      sinon.assert.calledOnce(push);
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      const component = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
      sinon.assert.calledOnce(push);
    });

    it('has a clickable yes button with update page enabled', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      const component = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
      sinon.assert.calledOnce(push);
    });
    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        routerObject,
      });
      const component = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
      sinon.assert.calledOnce(push);
    });
  });
});
