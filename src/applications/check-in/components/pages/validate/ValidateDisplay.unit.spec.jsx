/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import ValidateDisplay from './ValidateDisplay';

describe('check-in experience', () => {
  describe('shared components', () => {
    describe('ValidateDisplay', () => {
      it('renders with default values', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay />
          </CheckInProvider>,
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
          <CheckInProvider>
            <ValidateDisplay header="foo" />
          </CheckInProvider>,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay subtitle="foo" />
          </CheckInProvider>,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders loading message with status role if isLoading is true', () => {
        const { getByRole } = render(
          <CheckInProvider>
            <ValidateDisplay isLoading />
          </CheckInProvider>,
        );

        expect(getByRole('status')).to.exist;
      });
      it('renders continue button if isLoading false', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <ValidateDisplay isLoading={false} />
          </CheckInProvider>,
        );

        expect(getByTestId('check-in-button')).to.exist;
      });
      it('calls the validateHandler', () => {
        const validateHandler = sinon.spy();
        const { getByTestId } = render(
          <CheckInProvider>
            <ValidateDisplay validateHandler={validateHandler} />
          </CheckInProvider>,
        );

        getByTestId('check-in-button').click();
        expect(validateHandler.called).to.be.true;
      });
      describe('lastNameInput', () => {
        it('displays the value', () => {
          const { getByTestId } = render(
            <CheckInProvider>
              <ValidateDisplay lastNameInput={{ lastName: 'foo' }} />
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
              <ValidateDisplay showValidateError validateErrorMessage="Error" />
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
              <ValidateDisplay validateHandler={validateHandler} />
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
