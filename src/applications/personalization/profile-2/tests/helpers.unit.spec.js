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
