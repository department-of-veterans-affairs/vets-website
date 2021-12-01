import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import Demographics from '../Demographics';

describe('check in', () => {
  describe('Demographics', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
        },
      };
      store = mockStore(initState);
    });
    const demographics = {
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
    };

    it('renders', () => {
      const component = render(
        <Provider store={store}>
          <Demographics demographics={demographics} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.queryByText('Not available')).to.be.null;
    });

    it('shows "Not available" for unavailable fields', () => {
      const partialDemographics = {
        homeAddress: demographics.homeAddress,
        homePhone: demographics.homePhone,
        workPhone: demographics.workPhone,
      };

      const component = render(
        <Provider store={store}>
          <Demographics demographics={partialDemographics} />
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
          <Demographics demographics={demographics} />
        </Provider>,
      );
    });

    it('goes to the error page when the demographics data is unavailable', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {},
      };

      render(
        <Provider store={store}>
          <Demographics router={mockRouter} />
        </Provider>,
      );

      sinon.assert.calledOnce(push);
    });

    it('shows the loading indicator', () => {
      const { container } = render(
        <Provider store={store}>
          <Demographics isLoading />
        </Provider>,
      );

      expect(container.querySelector('va-loading-indicator')).to.have.attribute(
        'message',
        'Loading your appointments for today',
      );
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
          <Demographics demographics={demographics} router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('no-button').click();
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <Demographics demographics={demographics} router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('yes-button').click();
    });

    it('has a clickable yes button with update page enabled', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <Demographics
            demographics={demographics}
            isUpdatePageEnabled
            router={mockRouter}
          />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('yes-button').click();
    });
    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <Demographics demographics={demographics} router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
      component.getByTestId('yes-button').click();
    });
  });
});
