import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import {
  getServiceBranchDisplayName,
  prefixUtilityClasses,
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
});

describe('prefixUtilityClasses', () => {
  const classes = ['class-1', 'class-2'];
  it('should prefix an array of classes with `vads-u-`', () => {
    const expectedResult = ['vads-u-class-1', 'vads-u-class-2'];
    const result = prefixUtilityClasses(classes);
    expect(result).to.deep.equal(expectedResult);
  });
  describe('when passed a screenSize', () => {
    it('should prefix an array of classes with the responsive prefix and `vads-u-`', () => {
      const expectedResult = [
        'medium-screen:vads-u-class-1',
        'medium-screen:vads-u-class-2',
      ];
      const result = prefixUtilityClasses(classes, 'medium');
      expect(result).to.deep.equal(expectedResult);
    });
  });
});

describe('transformServiceHistoryEntryIntoTableRow', () => {
  // this FragmentWrapper is needed so we can use Enzyme to mount the
  // React.Fragments that our helper generates. A little bit of info on the
  // problem can be found in this GitHub issue
  // https://github.com/enzymejs/enzyme/issues/2327
  const FragmentWrapper = ({ children }) => <>{children}</>;
  const serviceHistory = {
    branchOfService: 'Army',
    beginDate: '2000-01-31',
    endDate: '2010-12-25',
  };
  let transformedData;

  it('should convert military service history into the format the ProfileInfoTable expects', () => {
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
      expect(value.text().includes('January 31, 2000 – December 25, 2010')).to
        .be.true;
    });
  });
});
