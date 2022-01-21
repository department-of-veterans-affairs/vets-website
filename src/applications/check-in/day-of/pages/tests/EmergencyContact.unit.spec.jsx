import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import EmergencyContact from '../EmergencyContact';

import { createMockRouter } from '../../../tests/unit/mocks/router';

describe('check in', () => {
  describe('EmergencyContact', () => {
    let store;
    const initState = {
      checkInData: {
        context: {
          token: '',
        },
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
        emergencyContact: {
          address: {
            street1: '445 Fine Finch Fairway',
            street2: 'Apt 201',
            city: 'Fairfence',
            state: 'Florida',
            zip: '445545',
          },
          name: 'Leslie',
          relationship: 'Aunt',
          phone: '5553334444',
          workPhone: '5554445555',
        },
      },
    };
    const middleware = [];
    const mockStore = configureStore(middleware);
    beforeEach(() => {
      store = mockStore(initState);
    });

    it('renders', () => {
      const component = render(
        <Provider store={store}>
          <EmergencyContact />
        </Provider>,
      );

      expect(component.getByText('Is this your current emergency contact?')).to
        .exist;
    });

    it('shows emergency contact felids, with message for empty data', () => {
      const updatedStore = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
          emergencyContact: {
            ...initState.checkInData.emergencyContact,
            phone: '',
            relationship: '',
          },
        },
      };
      const component = render(
        <Provider store={mockStore(updatedStore)}>
          <EmergencyContact />
        </Provider>,
      );

      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('Leslie')).to.exists;
      expect(component.queryByText('555-333-4444')).to.be.null;
      expect(component.queryByText('Aunt')).to.be.null;
      expect(component.getAllByText('Not available').length).to.equal(2);
    });

    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <EmergencyContact />
        </Provider>,
      );
    });

    it('goes to the error page when the data is unavailable', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        params: {},
      });
      const updatedStore = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
        },
      };
      render(
        <Provider store={mockStore(updatedStore)}>
          <EmergencyContact router={mockRouter} />
        </Provider>,
      );

      expect(push.calledOnce).to.be.true;
    });

    it('has a clickable no button', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <EmergencyContact router={mockRouter} />
        </Provider>,
      );

      component.getByTestId('no-button').click();
      expect(push.calledOnce).to.be.true;
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        params: {
          token: 'token-123',
        },
      });

      const component = render(
        <Provider store={store}>
          <EmergencyContact router={mockRouter} />
        </Provider>,
      );

      component.getByTestId('yes-button').click();
      expect(push.calledOnce).to.be.true;
    });
  });
});
