import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import UpdateInformationQuestion from '../UpdateInformationQuestion';

import { createMockRouter } from '../../../tests/unit/mocks/router';

describe('check in', () => {
  describe('UpdateInformationQuestion', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          appointment: {
            clinicPhone: '555-867-5309',
            appointmentTime: '2021-07-06 12:58:39 UTC',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
        },
      };
      store = mockStore(initState);
    });
    it('has a header', () => {
      const component = render(
        <Provider store={store}>
          <UpdateInformationQuestion />
        </Provider>,
      );

      expect(component.getByText('Do you need to update any information?')).to
        .exist;
    });
    it('uses a fieldset', () => {
      const { container } = render(
        <Provider store={store}>
          <UpdateInformationQuestion />
        </Provider>,
      );

      expect(container.querySelector('fieldset')).to.exist;
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
          <UpdateInformationQuestion router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Do you need to update any information?')).to
        .exist;
      component.getByTestId('yes-button').click();
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
          <UpdateInformationQuestion router={mockRouter} />
        </Provider>,
      );

      expect(component.getByText('Do you need to update any information?')).to
        .exist;
      component.getByTestId('no-button').click();
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <UpdateInformationQuestion />
        </Provider>,
      );
    });
  });
});
