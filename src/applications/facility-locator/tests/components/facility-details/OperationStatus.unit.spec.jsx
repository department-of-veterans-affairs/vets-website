import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import OperationStatus from '../../../components/facility-details/OperationStatus';
import { FacilityType } from '../../../constants';

describe('facility-locator', () => {
  describe('OperationStatus', () => {
    it('check in button passes axeCheck', () => {
      const operatingStatus = { code: 'NOTICE' };

      axeCheck(<OperationStatus operatingStatus={operatingStatus} />);
    });
    it('should render nothing for no operating status', () => {
      const { container } = render(<OperationStatus />);

      expect(container.firstChild).to.be.null;
    });
    it('should render nothing for normal status', () => {
      const operatingStatus = { code: 'NORMAL' };
      const { container } = render(
        <OperationStatus operatingStatus={operatingStatus} />,
      );
      expect(container.firstChild).to.be.null;
    });
    it('should render the operation status for  CLOSED', () => {
      const operatingStatus = { code: 'CLOSED' };
      const { getByText, container } = render(
        <OperationStatus operatingStatus={operatingStatus} />,
      );
      expect(getByText('Facility Closed')).to.be.ok;
      expect(
        container.querySelector('va-alert').getAttribute('status'),
      ).to.equal('error');
    });
    it('should render the operation status for NOTICE', () => {
      const operatingStatus = { code: 'NOTICE' };
      const { getByText, container } = render(
        <OperationStatus operatingStatus={operatingStatus} />,
      );
      expect(getByText('Facility notice')).to.be.ok;
      expect(
        container.querySelector('va-alert').getAttribute('status'),
      ).to.equal('info');
    });
    it('should render warning alert for status of limited', () => {
      const operatingStatus = { code: 'LIMITED' };
      const { getByText, container } = render(
        <OperationStatus operatingStatus={operatingStatus} />,
      );
      expect(getByText('Limited services and hours')).to.be.ok;
      expect(
        container.querySelector('va-alert').getAttribute('status'),
      ).to.equal('warning');
    });
    it('should render additionalInfo if it exists on the operatingStatus', () => {
      const operatingStatus = {
        code: 'NOTICE',
        additionalInfo: 'Additional info',
      };
      const { getByText } = render(
        <OperationStatus operatingStatus={operatingStatus} />,
      );
      expect(getByText('Additional info')).to.be.ok;
    });
    it('should render visitText website if it exists for facility type of VA_CEMETERY', () => {
      const operatingStatus = {
        code: 'NOTICE',
      };
      const { getByTestId } = render(
        <OperationStatus
          operatingStatus={operatingStatus}
          website="http://www.foo.bar.va.gov"
          facilityType={FacilityType.VA_CEMETERY}
        />,
      );
      expect(getByTestId('visit-text')).to.contain.text(
        'For more information about the cemetery including interment, visit',
      );
      expect(
        getByTestId('visit-text')
          .querySelector('va-link')
          .getAttribute('href'),
      ).to.equal('http://www.foo.bar.va.gov');
    });
    it('should render default visit text if website exists and is not NULL', () => {
      const operatingStatus = {
        code: 'NOTICE',
      };
      const { getByTestId } = render(
        <OperationStatus
          operatingStatus={operatingStatus}
          website="http://www.foo.bar.va.gov"
        />,
      );
      expect(getByTestId('visit-text')).to.contain.text(
        'to learn more about hours and services',
      );
      expect(
        getByTestId('visit-text')
          .querySelector('va-link')
          .getAttribute('href'),
      ).to.equal('http://www.foo.bar.va.gov');
    });
    it('should not render visit text is website is NULL', () => {
      const operatingStatus = {
        code: 'NOTICE',
      };
      const { queryByTestId } = render(
        <OperationStatus operatingStatus={operatingStatus} website="NULL" />,
      );
      expect(queryByTestId('visit-text')).to.be.null;
    });
    it('should not render visit text is website is falsy', () => {
      const operatingStatus = {
        code: 'NOTICE',
      };
      const { queryByTestId } = render(
        <OperationStatus operatingStatus={operatingStatus} />,
      );
      expect(queryByTestId('visit-text')).to.be.null;
    });
  });
});
