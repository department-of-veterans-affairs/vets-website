/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import ConfirmablePage from './index';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('ConfirmablePage', () => {
      it('renders custom header', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <ConfirmablePage header="foo" eyebrow="Check-In" />
          </CheckInProvider>,
        );
        expect(getByTestId('header')).to.contain.text('Check-In foo');
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <CheckInProvider>
            <ConfirmablePage subtitle="foo" />
          </CheckInProvider>,
        );
        expect(getByText('foo')).to.exist;
      });

      it('renders the data passed in, with label and data', () => {
        const dataFields = [{ key: 'foo', title: 'foo-title' }];
        const data = { foo: 'bar' };

        const { getByText } = render(
          <CheckInProvider>
            <ConfirmablePage data={data} dataFields={dataFields} />
          </CheckInProvider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
      });

      it('renders the travel warning alert if travel reimbursement is disabled', () => {
        const initState = {
          features: {
            /* eslint-disable-next-line camelcase */
            check_in_experience_travel_reimbursement: false,
          },
        };
        const { getByTestId } = render(
          <CheckInProvider store={initState}>
            <ConfirmablePage />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-btsss-message')).to.exist;
      });

      it('renders multiple data points the data passed in, with label and data', () => {
        const dataFields = [
          { key: 'foo', title: 'foo-title' },
          { key: 'baz', title: 'baz-title' },
        ];
        const data = { foo: 'bar', baz: 'qux' };

        const { getByText } = render(
          <CheckInProvider>
            <ConfirmablePage data={data} dataFields={dataFields} />
          </CheckInProvider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
        expect(getByText('baz-title')).to.exist;
        expect(getByText('qux')).to.exist;
      });
      it('renders not available is data is not found, with label and data', () => {
        const dataFields = [{ key: 'foo', title: 'foo-title' }];
        const data = { notFoo: 'bar' };

        const { getByText } = render(
          <CheckInProvider>
            <ConfirmablePage data={data} dataFields={dataFields} />
          </CheckInProvider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('Not available')).to.exist;
      });
      it('renders help text if provided', () => {
        const helpText = <div data-testid="help-text">FOO</div>;
        const { getByTestId } = render(
          <CheckInProvider>
            <ConfirmablePage helpText={helpText} />
          </CheckInProvider>,
        );
        expect(getByTestId('help-text')).to.exist;
      });
      it('does not render additional info components if not provided', () => {
        const { queryByTestId } = render(
          <CheckInProvider>
            <ConfirmablePage />
          </CheckInProvider>,
        );
        expect(queryByTestId('help-text')).to.not.exist;
        expect(queryByTestId('additional-info')).to.not.exist;
      });
      it('renders additional info if provided', () => {
        const additionalInfo = <div data-testid="additional-info">FOO</div>;
        const { getByTestId } = render(
          <CheckInProvider>
            <ConfirmablePage additionalInfo={additionalInfo} />
          </CheckInProvider>,
        );
        expect(getByTestId('additional-info')).to.exist;
      });
      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(
          <CheckInProvider>
            <ConfirmablePage yesAction={yesClick} />
          </CheckInProvider>,
        );
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(
          <CheckInProvider>
            <ConfirmablePage noAction={noClick} />
          </CheckInProvider>,
        );
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
    });
  });
});
