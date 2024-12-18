/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import TravelPage from './index';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('Check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('shared components', () => {
    describe('TravelPage', () => {
      it('renders custom header, eyebrow, body, and helptext', () => {
        const additionalInfoItems = [
          {
            info: 'test additional info',
            trigger: 'Additional Info Trigger',
          },
        ];

        const { getByText, getByTestId } = render(
          <CheckInProvider>
            <TravelPage
              header="test header"
              eyebrow="Check-In"
              bodyText="test body"
              additionalInfoItems={additionalInfoItems}
            />
          </CheckInProvider>,
        );
        expect(getByTestId('header')).to.contain.text('Check-In test header');
        expect(getByText('test body')).to.exist;
        expect(getByText('test additional info')).to.exist;
      });
      it('renders buttons', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelPage header="test header" />
          </CheckInProvider>,
        );
        expect(getByTestId('yes-button')).to.exist;
        expect(getByTestId('no-button')).to.exist;
      });
      it('renders buttons with custom text', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelPage
              header="test header"
              yesButtonText="yes test"
              noButtonText="no test"
            />
          </CheckInProvider>,
        );
        expect(getByTestId('yes-button').getAttribute('text')).to.equal(
          'yes test',
        );
        expect(getByTestId('no-button').getAttribute('text')).to.equal(
          'no test',
        );
      });
      it('fires custom yes and no functions', () => {
        const yesFunc = sinon.spy();
        const noFunc = sinon.spy();
        const screen = render(
          <CheckInProvider>
            <TravelPage
              header="test header"
              yesFunction={yesFunc}
              noFunction={noFunc}
            />
          </CheckInProvider>,
        );
        fireEvent.click(screen.getByTestId('yes-button'));
        fireEvent.click(screen.getByTestId('no-button'));
        expect(yesFunc.calledOnce).to.be.true;
        expect(noFunc.calledOnce).to.be.true;
      });
      it('renders OMB information', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelPage header="test header" />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-omb')).to.exist;
      });
    });
  });
});
