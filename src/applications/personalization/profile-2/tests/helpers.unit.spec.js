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
  it('should convert military service history into the format the ProfileInfoTable expects', () => {
    const serviceHistory = {
      branchOfService: 'Army',
      beginDate: '2000-01-31',
      endDate: '2010-12-25',
    };
    const transformedData = transformServiceHistoryEntryIntoTableRow(
      serviceHistory,
    );
    expect(transformedData.title).to.equal(
      `United States ${serviceHistory.branchOfService}`,
    );
    expect(transformedData.value).to.equal('Jan. 31, 2000 – Dec. 25, 2010');
  });
});
