import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

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
        address1: '123 Turtle Trail',
        city: 'Treetopper',
        state: 'Tennessee',
        zip: '101010',
      },
      homeAddress: {
        address1: '445 Fine Finch Fairway',
        address2: 'Apt 201',
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
          <Demographics demographics={{ demographics }} />
        </Provider>,
      );

      expect(component.getByText('Is this your current contact information?'))
        .to.exist;
    });

    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Demographics demographics={{ demographics }} />
        </Provider>,
      );
    });
  });
});
