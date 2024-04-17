import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import NextOfKinDisplay from './NextOfKinDisplay';

describe('pre-check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('shared components', () => {
    describe('NextOfKinDisplay', () => {
      it('renders with default values', () => {
        const { getByText } = render(
          <CheckInProvider>
            <NextOfKinDisplay />
          </CheckInProvider>,
        );

        expect(getByText('Is this your current next of kin information?')).to
          .exist;
      });
      it('renders custom header', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <NextOfKinDisplay header="foo" eyebrow="Check-In" />
          </CheckInProvider>,
        );

        expect(getByTestId('header')).to.contain.text('Check-In foo');
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <CheckInProvider>
            <NextOfKinDisplay subtitle="foo" />
          </CheckInProvider>,
        );
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
          <CheckInProvider>
            <NextOfKinDisplay nextOfKin={nextOfKinData} />
          </CheckInProvider>,
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
          <CheckInProvider>
            <NextOfKinDisplay nextOfKin={nextOfKinData} />
          </CheckInProvider>,
        );
        expect(getByText('VETERAN,JONAH')).to.exist;
        expect(getByText('BROTHER')).to.exist;
        expect(getByText('111-222-3333')).to.exist;
        expect(getByText('444-555-6666')).to.exist;
        expect(getByText('123 Main St')).to.exist;
        expect(getByText(', Ste 234')).to.exist;
        expect(getByText('Los Angeles, CA 90089')).to.exist;
      });
      it('renders additional info', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <NextOfKinDisplay yesAction={() => {}} noAction={() => {}} />
          </CheckInProvider>,
        );
        expect(getByTestId('additional-info')).to.exist;
      });
      it('renders help text', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <NextOfKinDisplay yesAction={() => {}} noAction={() => {}} />
          </CheckInProvider>,
        );
        expect(getByTestId('help-text')).to.exist;
      });
      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(
          <CheckInProvider>
            <NextOfKinDisplay yesAction={yesClick} noAction={() => {}} />
          </CheckInProvider>,
        );
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(
          <CheckInProvider>
            <NextOfKinDisplay yesAction={() => {}} noAction={noClick} />
          </CheckInProvider>,
        );
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
      it('renders the buttons', () => {
        const screen = render(
          <CheckInProvider>
            <NextOfKinDisplay yesAction={() => {}} noAction={() => {}} />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('no-button')).to.exist;
        expect(screen.getByTestId('yes-button')).to.exist;
      });
    });
  });
});
