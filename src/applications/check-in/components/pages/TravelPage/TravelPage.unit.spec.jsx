/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import TravelPage from './index';
import i18n from '../../../utils/i18n/i18n';

describe('Check-in experience', () => {
  describe('shared components', () => {
    let store;
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      checkInData: {
        context: {
          token: '',
        },
        form: {
          pages: [],
        },
      },
      ...scheduledDowntimeState,
    };
    beforeEach(() => {
      store = mockStore(initState);
    });
    describe('TravelPage', () => {
      it('passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <TravelPage header="test" router={{}} />
            </I18nextProvider>
          </Provider>,
        );
      });
      it('renders custom header, body, and helptext', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <TravelPage
                header="test header"
                bodyText="test body"
                helpText="test help text"
                router={{}}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('test header')).to.exist;
        expect(getByText('test body')).to.exist;
        expect(getByText('test help text')).to.exist;
      });
      it('renders buttons', () => {
        const { getByTestId } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <TravelPage header="test header" router={{}} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByTestId('yes-button')).to.exist;
        expect(getByTestId('no-button')).to.exist;
      });
    });
  });
});
