/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import ValidateDisplay from './ValidateDisplay';

describe('check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  const setDobError = () => {};
  describe('shared components', () => {
    describe('ValidateDisplay', () => {
      it('renders with default values', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay setDobError={setDobError} />
          </CheckInProvider>,
        );
        expect(getByText('Start checking in for your appointment')).to.exist;
        expect(
          getByText(
            'First, we need your last name and date of birth to make sure it’s you.',
          ),
        ).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay header="foo" setDobError={setDobError} />
          </CheckInProvider>,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay subtitle="foo" setDobError={setDobError} />
          </CheckInProvider>,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders loading message with status role if isLoading is true', () => {
        const { getByRole } = render(
          <CheckInProvider>
            <ValidateDisplay isLoading setDobError={setDobError} />
          </CheckInProvider>,
        );

        expect(getByRole('status')).to.exist;
      });
      it('renders continue button if isLoading false', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <ValidateDisplay isLoading={false} setDobError={setDobError} />
          </CheckInProvider>,
        );

        expect(getByTestId('check-in-button')).to.exist;
      });
      it('calls the validateHandler', () => {
        const validateHandler = sinon.spy();
        const { getByTestId } = render(
          <CheckInProvider>
            <ValidateDisplay
              validateHandler={validateHandler}
              setDobError={setDobError}
            />
          </CheckInProvider>,
        );

        getByTestId('check-in-button').click();
        expect(validateHandler.called).to.be.true;
      });
      describe('lastNameInput', () => {
        it('displays the value', () => {
          const { getByTestId } = render(
            <CheckInProvider>
              <ValidateDisplay
                lastNameInput={{ lastName: 'foo' }}
                setDobError={setDobError}
              />
            </CheckInProvider>,
          );

          expect(getByTestId('last-name-input').value).to.equal('foo');
        });
      });
      describe('dobInput', () => {
        it('passes the value to the web component', () => {
          const { getByTestId } = render(
            <CheckInProvider>
              <ValidateDisplay
                dobInput={{
                  dob: '1935-04-07',
                }}
                setDobError={setDobError}
              />
            </CheckInProvider>,
          );
          const date = getByTestId('dob-input').childNodes[0].value;
          expect(date).to.equal('1935-04-07');
        });
      });
      describe('validate Error message', () => {
        it('displays error alert', () => {
          const { getByTestId } = render(
            <CheckInProvider>
              <ValidateDisplay
                showValidateError
                validateErrorMessage="Error"
                setDobError={setDobError}
              />
            </CheckInProvider>,
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
            <CheckInProvider>
              <ValidateDisplay
                validateHandler={validateHandler}
                setDobError={setDobError}
              />
            </CheckInProvider>,
          );
          fireEvent.keyDown(getByTestId('last-name-input'), {
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
