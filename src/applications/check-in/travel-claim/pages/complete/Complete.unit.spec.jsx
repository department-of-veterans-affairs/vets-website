/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Complete from './index';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('Check-in experience', () => {
  describe('shared components', () => {
    describe('Complete', () => {
      it('renders content', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <Complete />
          </CheckInProvider>,
        );
        expect(getByTestId('header')).to.exist;
        expect(getByTestId('travel-info-external-link')).to.exist;
        expect(getByTestId('travel-complete-content')).to.exist;
      });
    });
  });
});
