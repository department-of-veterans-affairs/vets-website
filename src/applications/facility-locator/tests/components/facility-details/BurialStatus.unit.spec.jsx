import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import BurialStatus from '../../../components/facility-details/BurialStatus';
import { BurialStatusDisplay } from '../../../constants';

describe('facility-locator', () => {
  describe('BurialStatus', () => {
    it('should render the burial status of the provided facility', () => {
      Object.keys(BurialStatusDisplay).forEach(status => {
        const facility = {
          attributes: {
            operatingStatus: {
              supplementalStatus: [{ id: status }],
            },
          },
        };
        const { getByText } = render(<BurialStatus facility={facility} />);

        expect(getByText(BurialStatusDisplay[status].statusTitle)).to.be.ok;

        // The BurialStatusDisplay["default"] does not provide a statusDescription
        if (BurialStatusDisplay[status].statusDescription) {
          expect(getByText(BurialStatusDisplay[status].statusDescription)).to.be
            .ok;
        }
      });
    });
  });
});
