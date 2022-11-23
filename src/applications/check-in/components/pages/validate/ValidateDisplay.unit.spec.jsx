/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import sinon from 'sinon';
import i18n from '../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import ValidateDisplay from './ValidateDisplay';

describe('check-in experience', () => {
  describe('shared components', () => {
    describe('ValidateDisplay', () => {
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
        featureToggles: {
          check_in_experience_lorota_security_updates_enabled: false,
        },
        ...scheduledDowntimeState,
      };
      beforeEach(() => {
        store = mockStore(initState);
      });
      it('renders with default values', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ValidateDisplay />
            </I18nextProvider>
          </Provider>,
        );

        expect(getByText('Check in at VA')).to.exist;
        expect(
          getByText(
            'We need some information to verify your identity so we can check you in.',
          ),
        ).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ValidateDisplay header="foo" />
            </I18nextProvider>
          </Provider>,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ValidateDisplay subtitle="foo" />
            </I18nextProvider>
          </Provider>,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders loading message with status role if isLoading is true', () => {
        const { getByRole } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ValidateDisplay isLoading />
            </I18nextProvider>
          </Provider>,
        );

        expect(getByRole('status')).to.have.text('Loading...');
      });
      it('renders continue button if isLoading false', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ValidateDisplay isLoading={false} />
            </I18nextProvider>
          </Provider>,
        );

        expect(getByText('Continue')).to.exist;
      });
      it('calls the validateHandler', () => {
        const validateHandler = sinon.spy();
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ValidateDisplay validateHandler={validateHandler} />
            </I18nextProvider>
          </Provider>,
        );

        getByText('Continue').click();
        expect(validateHandler.called).to.be.true;
      });
      describe('lastNameInput', () => {
        it('displays the value', () => {
          const { getByTestId } = render(
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <ValidateDisplay lastNameInput={{ lastName: 'foo' }} />
              </I18nextProvider>
            </Provider>,
          );

          expect(getByTestId('last-name-input').value).to.equal('foo');
        });
      });
      describe('last4Input', () => {
        it('displays the value', () => {
          const { getByTestId } = render(
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <ValidateDisplay last4Input={{ last4Ssn: 'foo' }} />
              </I18nextProvider>
            </Provider>,
          );

          expect(getByTestId('last-4-input').value).to.equal('foo');
        });
      });
      describe('dobInput', () => {
        let dobStore;
        const dobInitState = {
          checkInData: {
            context: {
              token: '',
            },
            form: {
              pages: [],
            },
          },
          featureToggles: {
            check_in_experience_lorota_security_updates_enabled: true,
          },
          ...scheduledDowntimeState,
        };
        beforeEach(() => {
          dobStore = mockStore(dobInitState);
        });
        it('passes the value to the web component', () => {
          const { getByTestId } = render(
            <Provider store={dobStore}>
              <I18nextProvider i18n={i18n}>
                <ValidateDisplay
                  dobInput={{
                    dob: '1989-03-15',
                  }}
                />
              </I18nextProvider>
            </Provider>,
          );
          const date = getByTestId('dob-input').childNodes[0].value;
          expect(date).to.equal('1989-03-15');
        });
      });
      describe('validate Error message', () => {
        it('displays error alert', () => {
          const { getByTestId } = render(
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <ValidateDisplay
                  showValidateError
                  validateErrorMessage="Error"
                />
              </I18nextProvider>
            </Provider>,
          );
          expect(getByTestId('validate-error-alert').innerHTML).to.contain(
            'Error',
          );
        });
      });
      describe('Submits on enter', () => {
        it('calls the validateHandler', () => {
          const validateHandler = sinon.spy();
          const { getByTestId } = render(
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <ValidateDisplay validateHandler={validateHandler} />
              </I18nextProvider>
            </Provider>,
          );
          fireEvent.keyDown(getByTestId('last-4-input'), {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
          });
          expect(validateHandler.called).to.be.true;
        });
      });
    });
  });
});
