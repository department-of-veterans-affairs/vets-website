import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';

import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { CheckInButton } from '../CheckInButton';
import i18n from '../../../utils/i18n/i18n';

import { ELIGIBILITY } from '../../../utils/appointment/eligibility';

describe('check-in', () => {
  let mockRouter;
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
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
      },
    };
    store = mockStore(initState);

    mockRouter = {
      params: {
        token: 'token-123',
      },
      location: {
        pathname: '/third-page',
      },
    };
  });

  describe('CheckInButton', () => {
    it('should pass an axe check', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CheckInButton
              appointment={{
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );
    });
    it('should render with the check in text', () => {
      const { getByText } = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CheckInButton />
          </I18nextProvider>
        </Provider>,
      );
      expect(getByText('Check in now')).to.be.ok;
    });
    it('should a passed in onclick method', () => {
      const onClick = sinon.spy();
      const { getByTestId } = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CheckInButton onClick={onClick} />
          </I18nextProvider>
        </Provider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(onClick.calledOnce).to.be.true;
    });
    it('onclick should display the loading message', () => {
      const onClick = sinon.spy();
      const { getByTestId, getByRole } = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CheckInButton onClick={onClick} />,
          </I18nextProvider>
        </Provider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(getByTestId('check-in-button')).to.be.ok;
      expect(getByRole('status')).to.have.text('Loading...');
    });
    it('analytics event should not be recorded when before checkin window', () => {
      const onClick = sinon.spy();
      const recordEvent = sinon.spy();
      const { getByTestId } = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CheckInButton
              checkInWindowEnd={new Date(Date.now() + 60000)}
              eventRecorder={recordEvent}
              onClick={onClick}
              router={mockRouter}
            />
          </I18nextProvider>
        </Provider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(recordEvent.called).to.be.false;
    });
    it('analytics event should be recorded when after checkin window', () => {
      const onClick = sinon.spy();
      const recordEvent = sinon.spy();
      const { getByTestId } = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CheckInButton
              checkInWindowEnd={new Date(Date.now() - 60000)}
              eventRecorder={recordEvent}
              onClick={onClick}
              router={mockRouter}
            />
          </I18nextProvider>
        </Provider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(recordEvent.called).to.be.true;
    });
  });
});
