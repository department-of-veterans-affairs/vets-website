/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import TravelCompleteDisplay from './TravelCompleteDisplay';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('Check-in experience', () => {
  describe('shared components', () => {
    describe('TravelCompleteDisplay', () => {
      it('renders content', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelCompleteDisplay />
          </CheckInProvider>,
        );
        expect(getByTestId('header')).to.exist;
        expect(getByTestId('travel-info-external-link')).to.exist;
        expect(getByTestId('travel-complete-content')).to.exist;
      });
    });
  });
});
