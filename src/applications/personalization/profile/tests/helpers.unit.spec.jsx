import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import {
  getServiceBranchDisplayName,
  transformServiceHistoryEntryIntoTableRow,
} from '../helpers';

import { USA_MILITARY_BRANCHES } from '../constants';

describe('getServiceBranchDisplayName', () => {
  describe('when passed a valid USA military branches', () => {
    Object.values(USA_MILITARY_BRANCHES).forEach(branch => {
      it('should prefix the branch name with `United States`', () => {
        expect(getServiceBranchDisplayName(branch)).to.equal(
          `United States ${branch}`,
        );
      });
    });
  });

  describe('when not passed one of the five USA military branches', () => {
    it('should simply return what it was passed', () => {
      expect(getServiceBranchDisplayName('Other')).to.equal('Other');
    });
  });

  describe('when passed null, undefined, or empty string', () => {
    it('should return "Unknown branch of service" when passed null', () => {
      expect(getServiceBranchDisplayName(null)).to.equal(
        'Unknown branch of service',
      );
    });

    it('should return "Unknown branch of service" when passed undefined', () => {
      expect(getServiceBranchDisplayName(undefined)).to.equal(
        'Unknown branch of service',
      );
    });

    it('should return "Unknown branch of service" when passed empty string', () => {
      expect(getServiceBranchDisplayName('')).to.equal(
        'Unknown branch of service',
      );
    });
  });
});

describe('transformServiceHistoryEntryIntoTableRow', () => {
  // this FragmentWrapper is needed so we can use Enzyme to mount the
  // React.Fragments that our helper generates.
  const FragmentWrapper = ({ children }) => <>{children}</>;
  FragmentWrapper.propTypes = {
    children: PropTypes.node,
  };

  const serviceHistory = {
    branchOfService: 'Army',
    beginDate: '2000-01-31',
    endDate: '2010-12-25',
  };
  let transformedData;

  it('should convert military service history into the format the ProfileInfoCard expects', () => {
    transformedData = transformServiceHistoryEntryIntoTableRow(serviceHistory);
    expect(transformedData.title).not.to.be.undefined;
    expect(transformedData.value).not.to.be.undefined;
  });
  describe('title prop', () => {
    let title;
    beforeEach(() => {
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistory,
      );
      title = shallow(
        <FragmentWrapper>{transformedData.title}</FragmentWrapper>,
      );
    });
    afterEach(() => {
      title.unmount();
    });
    it('should have a hidden `dfn` element', () => {
      const titleDfn = title.find('dfn');
      expect(titleDfn.text()).to.equal('Service branch: ');
      expect(titleDfn.props().className).to.equal('sr-only');
    });
    it('should have the correct text', () => {
      expect(
        title
          .text()
          .includes(`United States ${serviceHistory.branchOfService}`),
      ).to.be.true;
    });
  });
  describe('value prop', () => {
    let value;
    beforeEach(() => {
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistory,
      );
      value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
    });
    afterEach(() => {
      value.unmount();
    });
    it('should have a hidden `dfn` element', () => {
      const titleDfn = value.find('dfn');
      expect(titleDfn.text()).to.equal('Dates of service: ');
      expect(titleDfn.props().className).to.equal('sr-only');
    });
    it('should have the correct text', () => {
      expect(value.text()).to.contain('January 31, 2000 – December 25, 2010');
    });
  });

  describe('date handling edge cases', () => {
    it('should handle missing beginDate (only endDate)', () => {
      const serviceHistoryNoBegin = {
        branchOfService: 'Navy',
        endDate: '2010-12-25',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryNoBegin,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      // When only endDate is present, format is " – December 25, 2010"
      expect(value.text()).to.contain('December 25, 2010');
      expect(value.text()).to.not.contain('January');
      value.unmount();
    });

    it('should handle missing endDate (only beginDate)', () => {
      const serviceHistoryNoEnd = {
        branchOfService: 'Air Force',
        beginDate: '2000-01-31',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryNoEnd,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      // When only beginDate is present, format is "January 31, 2000 – "
      expect(value.text()).to.contain('January 31, 2000');
      expect(value.text()).to.not.contain('December');
      value.unmount();
    });

    it('should handle both dates missing', () => {
      const serviceHistoryNoDates = {
        branchOfService: 'Marine Corps',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryNoDates,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      expect(value.text()).to.contain('Dates of service:');
      // Should not contain any date formatting (no month names)
      // The dateRange should be an empty string when both dates are missing
      expect(value.text()).to.not.contain('January');
      expect(value.text()).to.not.contain('December');
      value.unmount();
    });
  });

  describe('ServicePeriodText component branches', () => {
    it('should render ServicePeriodText when periodOfServiceTypeCode is "A" and text is provided', () => {
      const serviceHistoryWithA = {
        branchOfService: 'Army',
        beginDate: '2000-01-31',
        endDate: '2010-12-25',
        periodOfServiceTypeCode: 'A',
        periodOfServiceTypeText: 'Active duty member',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryWithA,
      );
      const value = mount(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      expect(value.text()).to.contain('Active duty member');
      value.unmount();
    });

    it('should render ServicePeriodText when periodOfServiceTypeCode is "V" and text is provided', () => {
      const serviceHistoryWithV = {
        branchOfService: 'Navy',
        beginDate: '2000-01-31',
        endDate: '2010-12-25',
        periodOfServiceTypeCode: 'V',
        periodOfServiceTypeText: 'Reserve member',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryWithV,
      );
      const value = mount(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      expect(value.text()).to.contain('Reserve member');
      value.unmount();
    });

    it('should not render ServicePeriodText when periodOfServiceTypeCode is invalid (not "A" or "V")', () => {
      const serviceHistoryInvalidCode = {
        branchOfService: 'Army',
        beginDate: '2000-01-31',
        endDate: '2010-12-25',
        periodOfServiceTypeCode: 'X',
        periodOfServiceTypeText: 'Unsupported member',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryInvalidCode,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      expect(value.text()).to.not.contain('Unsupported member');
      value.unmount();
    });

    it('should not render ServicePeriodText when periodOfServiceTypeCode is missing but text is provided', () => {
      const serviceHistoryNoCode = {
        branchOfService: 'Air Force',
        beginDate: '2000-01-31',
        endDate: '2010-12-25',
        periodOfServiceTypeText: 'Some text',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryNoCode,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      expect(value.text()).to.not.contain('Some text');
      value.unmount();
    });

    it('should not render ServicePeriodText when periodOfServiceTypeText is missing but code is provided', () => {
      const serviceHistoryNoText = {
        branchOfService: 'Coast Guard',
        beginDate: '2000-01-31',
        endDate: '2010-12-25',
        periodOfServiceTypeCode: 'A',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryNoText,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      // Should still have the dates but no period text
      expect(value.text()).to.contain('January 31, 2000');
      value.unmount();
    });

    it('should not render ServicePeriodText when both code and text are missing', () => {
      const serviceHistoryNone = {
        branchOfService: 'Space Force',
        beginDate: '2000-01-31',
        endDate: '2010-12-25',
      };
      transformedData = transformServiceHistoryEntryIntoTableRow(
        serviceHistoryNone,
      );
      const value = shallow(
        <FragmentWrapper>{transformedData.value}</FragmentWrapper>,
      );
      // Should only have dates, no period text
      expect(value.text()).to.contain('January 31, 2000');
      value.unmount();
    });
  });
});
