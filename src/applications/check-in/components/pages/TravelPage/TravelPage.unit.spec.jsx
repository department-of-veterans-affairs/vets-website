/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import sinon from 'sinon';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import TravelPage from './index';
import i18n from '../../../utils/i18n/i18n';
import { createMockRouter } from '../../../tests/unit/mocks/router';

describe('Check-in experience', () => {
  describe('shared components', () => {
    let store;
    const middleware = [];
    const mockStore = configureStore(middleware);
    const mockRouter = createMockRouter();
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
      it('calls createHref', () => {
        mockRouter.createHref = sinon.spy();
        render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <TravelPage router={mockRouter} />
            </I18nextProvider>
          </Provider>,
        );
        expect(mockRouter.createHref.calledOnce).to.be.true;
      });
      it('renders custom header, body, and helptext', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <TravelPage
                header="test header"
                bodyText="test body"
                helpText="test help text"
                router={mockRouter}
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
              <TravelPage header="test header" router={mockRouter} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByTestId('yes-button')).to.exist;
        expect(getByTestId('no-button')).to.exist;
      });
    });
  });
});
