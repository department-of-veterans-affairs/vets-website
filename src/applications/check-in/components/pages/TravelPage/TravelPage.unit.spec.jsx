/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import TravelPage from './index';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('Check-in experience', () => {
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
    });
  });
});
