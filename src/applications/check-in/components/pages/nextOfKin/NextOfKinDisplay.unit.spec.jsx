import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import NextOfKinDisplay from './NextOfKinDisplay';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('NextOfKinDisplay', () => {
      it('passes axeCheck', () => {
        axeCheck(<NextOfKinDisplay />);
      });
      it('renders with default values', () => {
        const { getByText } = render(<NextOfKinDisplay />);

        expect(getByText('Is this your current next of kin information?')).to
          .exist;
      });
      it('renders the footer if footer is supplied', () => {
        const { getByText } = render(
          // eslint-disable-next-line react/jsx-no-bind
          <NextOfKinDisplay Footer={() => <div>foo</div>} />,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(<NextOfKinDisplay header="foo" />);

        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(<NextOfKinDisplay subtitle="foo" />);
        expect(getByText('foo')).to.exist;
      });
      it('renders next of kin labels', () => {
        const nextOfKinData = {
          name: 'VETERAN,JONAH',
          relationship: 'BROTHER',
          phone: '1112223333',
          workPhone: '4445556666',
          address: {
            street1: '123 Main St',
            street2: 'Ste 234',
            street3: '',
            city: 'Los Angeles',
            county: 'Los Angeles',
            state: 'CA',
            zip: '90089',
            zip4: '',
            country: 'USA',
          },
        };
        const { getByText } = render(
          <NextOfKinDisplay nextOfKin={nextOfKinData} />,
        );
        expect(getByText('Name')).to.exist;
        expect(getByText('Relationship')).to.exist;
        expect(getByText('Address')).to.exist;
        expect(getByText('Phone')).to.exist;
        expect(getByText('Work phone')).to.exist;
      });
      it('renders next of kin values', () => {
        const nextOfKinData = {
          name: 'VETERAN,JONAH',
          relationship: 'BROTHER',
          phone: '1112223333',
          workPhone: '4445556666',
          address: {
            street1: '123 Main St',
            street2: 'Ste 234',
            street3: '',
            city: 'Los Angeles',
            county: 'Los Angeles',
            state: 'CA',
            zip: '90089',
            zip4: '',
            country: 'USA',
          },
        };
        const { getByText } = render(
          <NextOfKinDisplay nextOfKin={nextOfKinData} />,
        );
        expect(getByText('VETERAN,JONAH')).to.exist;
        expect(getByText('BROTHER')).to.exist;
        expect(getByText('111-222-3333')).to.exist;
        expect(getByText('444-555-6666')).to.exist;
        expect(getByText('123 Main St')).to.exist;
        expect(getByText(', Ste 234')).to.exist;
        expect(getByText('Los Angeles, CA 90089')).to.exist;
      });
      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(<NextOfKinDisplay yesAction={yesClick} />);
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(<NextOfKinDisplay noAction={noClick} />);
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
      it('renders the loading message', () => {
        const screen = render(<NextOfKinDisplay isSendingData />);
        expect(screen.queryByTestId('no-button')).to.not.exist;
        expect(screen.queryByTestId('yes-button')).to.not.exist;
        expect(screen.getByTestId('loading-message')).to.exist;
      });
      it('renders the buttons', () => {
        const screen = render(<NextOfKinDisplay isSendingData={false} />);
        expect(screen.getByTestId('no-button')).to.exist;
        expect(screen.getByTestId('yes-button')).to.exist;
      });
    });
  });
});
