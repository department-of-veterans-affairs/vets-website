import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import Demographics from '../Demographics';

import { createMockRouter } from '../../../tests/unit/mocks/router';

describe('check in', () => {
  describe('Demographics', () => {
    let store;
    const initState = {
      checkInData: {
        context: {
          token: '',
        },
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
        veteranData: {
          demographics: {
            mailingAddress: {
              street1: '123 Turtle Trail',
              city: 'Treetopper',
              state: 'Tennessee',
              zip: '101010',
            },
            homeAddress: {
              street1: '445 Fine Finch Fairway',
              street2: 'Apt 201',
              city: 'Fairfence',
              state: 'Florida',
              zip: '445545',
            },
            homePhone: '5552223333',
            mobilePhone: '5553334444',
            workPhone: '5554445555',
            emailAddress: 'kermit.frog@sesameenterprises.us',
          },
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
          <Demographics />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
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
              homeAddress:
                initState.checkInData.veteranData.demographics.homeAddress,
              homePhone:
                initState.checkInData.veteranData.demographics.homePhone,
              workPhone:
                initState.checkInData.veteranData.demographics.workPhone,
            },
          },
        },
      };
      const component = render(
        <Provider store={mockStore(updatedStore)}>
          <Demographics />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('555-222-3333')).to.exist;
      expect(component.queryByText('123 Turtle Trail')).to.be.null;
      expect(component.queryByText('5553334444')).to.be.null;
      expect(component.getAllByText('Not available')).to.exist;
    });

    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Demographics />
        </Provider>,
      );
    });

    it('goes to the error page when the demographics data is unavailable', () => {
      const push = sinon.spy();

      const updatedStore = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
          veteranData: {},
        },
      };

      render(
        <Provider store={mockStore(updatedStore)}>
          <Demographics
            router={createMockRouter({
              push,
              params: {},
            })}
          />
        </Provider>,
      );

      sinon.assert.calledOnce(push);
    });

    it('has a clickable no button', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        params: {
          token: 'token-123',
        },
      });

      const component = render(
        <Provider store={store}>
          <Demographics router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('no-button').click();
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
          <Demographics router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('yes-button').click();
    });

    it('has a clickable yes button with update page enabled', () => {
      const push = sinon.spy();
      const mockRouter = createMockRouter({
        push,
        params: {
          token: 'token-123',
        },
      });

      const component = render(
        <Provider store={store}>
          <Demographics router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('yes-button').click();
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
          <Demographics router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('yes-button').click();
    });
  });
});
