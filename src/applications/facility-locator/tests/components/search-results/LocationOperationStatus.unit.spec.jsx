import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import LocationOperationStatus from '../../../components/search-results-items/common/LocationOperationStatus';

describe('facility-locator', () => {
  describe('LocationOperationStatus', () => {
    it('check in button passes axeCheck', () => {
      const operatingStatus = { code: 'CLOSED' };
      axeCheck(<LocationOperationStatus operatingStatus={operatingStatus} />);
    });
    it('should render nothing for status LIMITED', () => {
      const operatingStatus = { code: 'LIMITED' };
      const { container } = render(
        <LocationOperationStatus operatingStatus={operatingStatus} />,
      );
      expect(container.firstChild).to.equal(null);
    });
    it('should render the operation status for  CLOSED', () => {
      const operatingStatus = { code: 'CLOSED' };
      const { getByText } = render(
        <LocationOperationStatus operatingStatus={operatingStatus} />,
      );
      expect(getByText('Facility Closed')).to.be.ok;
    });
    it('should render the operation status for NOTICE', () => {
      const operatingStatus = { code: 'NOTICE' };
      const { getByText } = render(
        <LocationOperationStatus operatingStatus={operatingStatus} />,
      );
      expect(getByText('Facility notice')).to.be.ok;
    });
  });
});
