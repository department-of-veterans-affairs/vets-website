import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import i18n from '../../utils/i18n/i18n';
import BackButton from '../BackButton';

describe('check-in', () => {
  describe('BackButton', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: [
              'loading-appointments',
              'second-page',
              'third-page',
              'fourth-page',
            ],
          },
        },
      };
      store = mockStore(initState);
    });
    const mockRouterThirdPage = {
      location: {
        pathname: '/third-page',
      },
    };
    it('Renders', () => {
      const goBack = sinon.spy();
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <BackButton action={goBack} router={mockRouterThirdPage} />
          </I18nextProvider>
        </Provider>,
      );

      expect(screen.getByTestId('back-button')).to.exist;
      expect(screen.getByTestId('back-button')).to.have.text(
        'Back to last screen',
      );
    });
    it('click fires router goBack', () => {
      const goBack = sinon.spy();
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <BackButton action={goBack} router={mockRouterThirdPage} />
          </I18nextProvider>
        </Provider>,
      );

      expect(screen.getByTestId('back-button')).to.exist;
      fireEvent.click(screen.getByTestId('back-button'));
      expect(goBack.calledOnce).to.be.true;
    });
    it("doesn't render if it is the first confirmation", () => {
      const mockRouter = {
        location: {
          pathname: '/second-page',
        },
      };
      const goBack = sinon.spy();
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <BackButton action={goBack} router={mockRouter} />
          </I18nextProvider>
        </Provider>,
      );
      expect(screen.queryByTestId('back-button')).to.not.exist;
    });
  });
});
