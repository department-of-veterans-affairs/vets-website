import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import ValidateDisplay from './ValidateDisplay';

describe('check-in experience', () => {
  describe('shared components', () => {
    describe('ValidateDisplay', () => {
      it('passes axeCheck', () => {
        axeCheck(<ValidateDisplay />);
      });
      it('renders with default values', () => {
        const { getByText } = render(<ValidateDisplay />);

        expect(getByText('Check in at VA')).to.exist;
        expect(
          getByText(
            'We need some information to verify your identity so we can check you in.',
          ),
        ).to.exist;
      });
      it('renders the footer if footer is supplied', () => {
        const { getByText } = render(
          // eslint-disable-next-line react/jsx-no-bind
          <ValidateDisplay Footer={() => <div>foo</div>} />,
        );

        expect(getByText('foo')).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(<ValidateDisplay header="foo" />);

        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(<ValidateDisplay subtitle="foo" />);

        expect(getByText('foo')).to.exist;
      });
      it('renders loading message with status role if isLoading is true', () => {
        const { getByRole } = render(<ValidateDisplay isLoading />);

        expect(getByRole('status')).to.have.text('Loading...');
      });
      it('renders continue button if isLoading false', () => {
        const { getByText } = render(<ValidateDisplay isLoading={false} />);

        expect(getByText('Continue')).to.exist;
      });
      it('calls the validateHandler', () => {
        const validateHandler = sinon.spy();
        const { getByText } = render(
          <ValidateDisplay validateHandler={validateHandler} />,
        );

        getByText('Continue').click();
        expect(validateHandler.called).to.be.true;
      });
      describe('lastNameInput', () => {
        it('displays the value', () => {
          const { getByTestId } = render(
            <ValidateDisplay lastNameInput={{ lastName: 'foo' }} />,
          );

          expect(getByTestId('last-name-input').value).to.equal('foo');
        });
      });
      describe('last4Input', () => {
        it('displays the value', () => {
          const { getByTestId } = render(
            <ValidateDisplay last4Input={{ last4Ssn: 'foo' }} />,
          );

          expect(getByTestId('last-4-input').value).to.equal('foo');
        });
      });
      describe('validate Error message', () => {
        it('displays error alert', () => {
          const { getByTestId } = render(
            <ValidateDisplay showValidateError validateErrorMessage="Error" />,
          );
          expect(getByTestId('validate-error-alert').innerHTML).to.contain(
            'Error',
          );
        });
      });
    });
  });
});
