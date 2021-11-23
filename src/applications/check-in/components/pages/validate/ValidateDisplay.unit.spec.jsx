import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ValidateDisplay from './ValidateDisplay';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

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
      it('renders loading message if isLoading is true', () => {
        const { getByText } = render(<ValidateDisplay isLoading />);

        expect(getByText('Loading...')).to.exist;
      });
      it('renders loading message if isLoading is true', () => {
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
    });
  });
});
