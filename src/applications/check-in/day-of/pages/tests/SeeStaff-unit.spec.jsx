import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { I18nextProvider } from 'react-i18next';

import { axeCheck } from '@department-of-veterans-affairs/platform-forms-systems/test/config/helpers';
import i18n from '../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import { createMockRouter } from '../../../tests/unit/mocks/router';

import SeeStaff from '../SeeStaff';

describe('check in', () => {
  describe('SeeStaff', () => {
    const routerObject = {
      params: {
        token: 'token-123',
      },
      location: {
        pathname: '/first-page',
      },
      goBack: () => {},
    };
    const push = () => {};
    const mockRouter = createMockRouter({
      push,
      routerObject,
    });
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      checkInData: {
        seeStaffMessage: 'message test',
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
      },
      ...scheduledDowntimeState,
    };
    const store = mockStore(initState);
    it('has a header', () => {
      const component = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <SeeStaff router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );

      expect(component.getByText('message test')).to.exist;
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <SeeStaff router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );
    });
  });
});
