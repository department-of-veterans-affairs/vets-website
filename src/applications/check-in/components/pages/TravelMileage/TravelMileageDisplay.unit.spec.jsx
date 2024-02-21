/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import TravelMileageDisplay from './TravelMileageDisplay';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('Check-in experience', () => {
  describe('shared components', () => {
    describe('TravelMileageDisplay', () => {
      it('renders custom header', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelMileageDisplay header="test header" buttonClick={() => {}} />
          </CheckInProvider>,
        );
        expect(getByTestId('header')).to.exist;
      });
      it('renders button', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelMileageDisplay header="test header" />
          </CheckInProvider>,
        );
        expect(getByTestId('yes-button')).to.exist;
      });
      it('renders working buttons', () => {
        const spy = sinon.spy();
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelMileageDisplay header="test header" buttonClick={spy} />
          </CheckInProvider>,
        );
        fireEvent.click(getByTestId('yes-button'));
        expect(spy.calledOnce).to.be.true;
      });
    });
  });
});
