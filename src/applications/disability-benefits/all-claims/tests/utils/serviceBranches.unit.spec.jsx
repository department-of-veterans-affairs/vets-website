import { expect } from 'chai';

import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';

import {
  processBranches,
  getBranches,
  testBranches,
  clearBranches,
  fetchBranches,
  migrateBranches,
} from '../../utils/serviceBranches';
import { SERVICE_BRANCHES } from '../../constants';

describe('Service branches utils', () => {
  afterEach(() => {
    clearBranches();
  });

  const mockData = [
    { description: 'a' },
    { description: 'c' },
    { description: 'b' },
  ];
  const mockResult = ['a', 'b', 'c'];

  describe('processBranches', () => {
    it('should return a sorted descriptions array & set sessionStorage', () => {
      expect(processBranches(mockData)).to.deep.equal(mockResult);
      expect(window.sessionStorage.getItem(SERVICE_BRANCHES)).to.equal(
        '["a","b","c"]',
      );
    });
  });

  describe('getBranches', () => {
    it('should populate the internal array and session storage', () => {
      processBranches(mockData);
      expect(getBranches()).to.deep.equal(mockResult);
    });
  });

  describe('testBranches', () => {
    it('should populate the internal array and session storage', () => {
      testBranches();
      expect(getBranches().length).to.not.equal(3);
    });
  });

  describe('clearBranches', () => {
    it('should clear the internal array and session storage', () => {
      processBranches(mockData);
      expect(getBranches().length).to.equal(3);
      clearBranches();
      expect(getBranches().length).to.equal(0);
    });
  });

  describe('fetchBranches', () => {
    afterEach(() => {
      resetFetch();
    });
    it('should fetch succeed with API data', () => {
      mockApiRequest({ items: mockData });
      return fetchBranches().then(result => {
        expect(result).to.deep.equal(mockResult);
      });
    });

    it('should fail to fetch and use fallback data', () => {
      mockApiRequest({ items: mockData }, false);
      return fetchBranches().then(result => {
        expect(result).to.deep.equal(processBranches());
      });
    });
  });

  describe('migrateBranches', () => {
    const getData = branch => ({
      serviceInformation: {
        servicePeriods: [
          {
            serviceBranch: branch,
            dateRange: { from: '2000-01-01', to: '2001-01-01' },
          },
        ],
        'view:militaryHistoryNote': {
          type: 'object',
          properties: {},
        },
      },
    });

    it('should migrate reserve to reserves (case insensitive)', () => {
      expect(migrateBranches(getData('Air FORCE Reserve'))).to.deep.equal(
        getData('Air Force Reserves'),
      );
      expect(migrateBranches(getData('ARMY Reserve'))).to.deep.equal(
        getData('Army Reserves'),
      );
      expect(migrateBranches(getData('army reserve'))).to.deep.equal(
        getData('Army Reserves'),
      );
      expect(migrateBranches(getData('Coast Guard Reserve'))).to.deep.equal(
        getData('Coast Guard Reserves'),
      );
      expect(migrateBranches(getData('Marine Corps Reserve'))).to.deep.equal(
        getData('Marine Corps Reserves'),
      );
      expect(migrateBranches(getData('Navy Reserve'))).to.deep.equal(
        getData('Navy Reserves'),
      );
    });
    it('should migrate NOAA to full name', () => {
      expect(migrateBranches(getData('NOAA'))).to.deep.equal(
        getData('National Oceanic & Atmospheric Administration'),
      );
      expect(migrateBranches(getData('noaa'))).to.deep.equal(
        getData('National Oceanic & Atmospheric Administration'),
      );
    });
    it('should not migrate same-name branches', () => {
      [
        'Air Force',
        'Air National Guard',
        'Army',
        'Army National Guard',
        'Coast Guard',
        'Marine Corps',
        'Navy',
        'Public Health Service',
      ].forEach(branch => {
        const data = getData(branch);
        expect(migrateBranches(data)).to.deep.equal(data);
      });
    });
  });
});
