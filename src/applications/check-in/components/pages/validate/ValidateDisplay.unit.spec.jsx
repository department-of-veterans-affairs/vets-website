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

        expect(getByRole('status')).to.have.text('Loading...');
      });
      it('renders continue button if isLoading false', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay isLoading={false} />
          </CheckInProvider>,
        );

        expect(getByText('Continue')).to.exist;
      });
      it('calls the validateHandler', () => {
        const validateHandler = sinon.spy();
        const { getByText } = render(
          <CheckInProvider>
            <ValidateDisplay validateHandler={validateHandler} />
          </CheckInProvider>,
        );

        getByText('Continue').click();
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
