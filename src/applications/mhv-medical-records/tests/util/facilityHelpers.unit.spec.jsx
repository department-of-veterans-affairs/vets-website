import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  formatFacilityUnorderedList,
  formatCutoverDate,
  createBeforeCutoverFacilityNames,
  createAfterCutoverFacilityNames,
} from '../../util/facilityHelpers';

describe('facilityHelpers', () => {
  describe('formatFacilityUnorderedList', () => {
    it('should return NONE_RECORDED when facilities is null', () => {
      expect(formatFacilityUnorderedList(null)).to.equal('None recorded');
    });

    it('should return NONE_RECORDED when facilities is undefined', () => {
      expect(formatFacilityUnorderedList(undefined)).to.equal('None recorded');
    });

    it('should return NONE_RECORDED when facilities is an empty array', () => {
      expect(formatFacilityUnorderedList([])).to.equal('None recorded');
    });

    it('should render a single facility in an unordered list', () => {
      const facilities = ['VA Western New York health care'];
      const { container } = render(formatFacilityUnorderedList(facilities));

      const list = container.querySelector('ul');
      const items = container.querySelectorAll('li');

      expect(list).to.exist;
      expect(items).to.have.lengthOf(1);
      expect(items[0].textContent).to.equal('VA Western New York health care');
    });

    it('should render multiple facilities in an unordered list', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
        'VA Central Ohio health care',
      ];
      const { container } = render(formatFacilityUnorderedList(facilities));

      const list = container.querySelector('ul');
      const items = container.querySelectorAll('li');

      expect(list).to.exist;
      expect(items).to.have.lengthOf(3);
      expect(items[0].textContent).to.equal('VA Western New York health care');
      expect(items[1].textContent).to.equal('VA Pacific Islands health care');
      expect(items[2].textContent).to.equal('VA Central Ohio health care');
    });

    it('should render two facilities in an unordered list', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
      ];
      const { container } = render(formatFacilityUnorderedList(facilities));

      const list = container.querySelector('ul');
      const items = container.querySelectorAll('li');

      expect(list).to.exist;
      expect(items).to.have.lengthOf(2);
      expect(items[0].textContent).to.equal('VA Western New York health care');
      expect(items[1].textContent).to.equal('VA Pacific Islands health care');
    });
  });

  describe('formatCutoverDate', () => {
    it('should format a date string into readable format', () => {
      const result = formatCutoverDate('2020-10-24');
      expect(result).to.equal('October 24, 2020');
    });

    it('should format another date correctly', () => {
      const result = formatCutoverDate('2022-03-26');
      expect(result).to.equal('March 26, 2022');
    });

    it('should handle dates at beginning of month', () => {
      const result = formatCutoverDate('2022-04-01');
      expect(result).to.equal('April 1, 2022');
    });

    it('should handle dates at end of month', () => {
      const result = formatCutoverDate('2022-06-30');
      expect(result).to.equal('June 30, 2022');
    });
  });

  describe('createBeforeCutoverFacilityNames', () => {
    const mockGetNameFn = (ehrData, facilityId) => ehrData[facilityId]?.name;
    const mockEhrData = {
      757: { name: 'VA Central Ohio health care' },
      668: { name: 'VA Spokane health care' },
      999: { name: 'VA Unknown health care' },
    };
    const mockTransitionTable = {
      757: { cutoverDate: '2022-04-30' },
      668: { cutoverDate: '2020-10-24' },
    };

    it('should return empty array when ehrDataByVhaId is null', () => {
      const result = createBeforeCutoverFacilityNames(
        [{ facilityId: '757' }],
        null,
        mockTransitionTable,
        mockGetNameFn,
      );
      expect(result).to.deep.equal([]);
    });

    it('should return empty array when ohFacilities is null', () => {
      const result = createBeforeCutoverFacilityNames(
        null,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );
      expect(result).to.deep.equal([]);
    });

    it('should return empty array when ohFacilities is empty', () => {
      const result = createBeforeCutoverFacilityNames(
        [],
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );
      expect(result).to.deep.equal([]);
    });

    it('should return facility name with bolded "before [date]" suffix for transitioned facility', () => {
      const ohFacilities = [{ facilityId: '757' }];
      const result = createBeforeCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('id', '757-before');
      expect(result[0]).to.have.property('content');

      // Render the JSX to test the content
      const { container } = render(<div>{result[0].content}</div>);
      expect(container.textContent).to.include('VA Central Ohio health care');
      expect(container.textContent).to.include('(before April 30, 2022)');
      expect(container.querySelector('strong')).to.exist;
      // The entire parenthetical is bolded
      expect(container.querySelector('strong').textContent).to.equal(
        '(before April 30, 2022)',
      );
    });

    it('should return plain facility name for facility not in transition table', () => {
      const ohFacilities = [{ facilityId: '999' }];
      const result = createBeforeCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('id', '999');
      expect(result[0]).to.have.property('content', 'VA Unknown health care');
    });

    it('should handle multiple facilities with mixed transition status', () => {
      const ohFacilities = [
        { facilityId: '757' },
        { facilityId: '999' },
        { facilityId: '668' },
      ];
      const result = createBeforeCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(3);

      // First result should have bolded date
      expect(result[0]).to.have.property('id', '757-before');
      const { container: container1 } = render(<div>{result[0].content}</div>);
      expect(container1.textContent).to.include('(before April 30, 2022)');

      // Second result should be plain string
      expect(result[1]).to.have.property('id', '999');
      expect(result[1]).to.have.property('content', 'VA Unknown health care');

      // Third result should have bolded date
      expect(result[2]).to.have.property('id', '668-before');
      const { container: container3 } = render(<div>{result[2].content}</div>);
      expect(container3.textContent).to.include('(before October 24, 2020)');
    });

    it('should filter out facilities with no name lookup result', () => {
      const ohFacilities = [{ facilityId: 'nonexistent' }];
      const result = createBeforeCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.deep.equal([]);
    });

    it('should return plain facility name for facility with future cutover date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const futureTransitionTable = {
        757: { cutoverDate: futureDateStr },
      };
      const ohFacilities = [{ facilityId: '757' }];
      const result = createBeforeCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        futureTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('id', '757');
      expect(result[0]).to.have.property(
        'content',
        'VA Central Ohio health care',
      );
    });
  });

  describe('createAfterCutoverFacilityNames', () => {
    const mockGetNameFn = (ehrData, facilityId) => ehrData[facilityId]?.name;
    const mockEhrData = {
      757: { name: 'VA Central Ohio health care' },
      668: { name: 'VA Spokane health care' },
      999: { name: 'VA Unknown health care' },
    };
    const mockTransitionTable = {
      757: { cutoverDate: '2022-04-30' },
      668: { cutoverDate: '2020-10-24' },
    };

    it('should return empty array when ehrDataByVhaId is null', () => {
      const result = createAfterCutoverFacilityNames(
        [{ facilityId: '757' }],
        null,
        mockTransitionTable,
        mockGetNameFn,
      );
      expect(result).to.deep.equal([]);
    });

    it('should return empty array when ohFacilities is null', () => {
      const result = createAfterCutoverFacilityNames(
        null,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );
      expect(result).to.deep.equal([]);
    });

    it('should return empty array when ohFacilities is empty', () => {
      const result = createAfterCutoverFacilityNames(
        [],
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );
      expect(result).to.deep.equal([]);
    });

    it('should return facility name with bolded "[date] - present" suffix for transitioned facility', () => {
      const ohFacilities = [{ facilityId: '757' }];
      const result = createAfterCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('id', '757-after');
      expect(result[0]).to.have.property('content');

      // Render the JSX to test the content
      const { container } = render(<div>{result[0].content}</div>);
      expect(container.textContent).to.include('VA Central Ohio health care');
      expect(container.textContent).to.include('(April 30, 2022-present)');
      expect(container.querySelector('strong')).to.exist;
      // The entire parenthetical is bolded
      expect(container.querySelector('strong').textContent).to.equal(
        '(April 30, 2022-present)',
      );
    });

    it('should return plain facility name for facility not in transition table', () => {
      const ohFacilities = [{ facilityId: '999' }];
      const result = createAfterCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('id', '999');
      expect(result[0]).to.have.property('content', 'VA Unknown health care');
    });

    it('should handle multiple facilities with mixed transition status', () => {
      const ohFacilities = [
        { facilityId: '757' },
        { facilityId: '999' },
        { facilityId: '668' },
      ];
      const result = createAfterCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(3);

      // First result should have bolded date
      expect(result[0]).to.have.property('id', '757-after');
      const { container: container1 } = render(<div>{result[0].content}</div>);
      expect(container1.textContent).to.include('(April 30, 2022-present)');

      // Second result should be plain string
      expect(result[1]).to.have.property('id', '999');
      expect(result[1]).to.have.property('content', 'VA Unknown health care');

      // Third result should have bolded date
      expect(result[2]).to.have.property('id', '668-after');
      const { container: container3 } = render(<div>{result[2].content}</div>);
      expect(container3.textContent).to.include('(October 24, 2020-present)');
    });

    it('should filter out facilities with no name lookup result', () => {
      const ohFacilities = [{ facilityId: 'nonexistent' }];
      const result = createAfterCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        mockTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.deep.equal([]);
    });

    it('should return plain facility name for facility with future cutover date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const futureTransitionTable = {
        757: { cutoverDate: futureDateStr },
      };
      const ohFacilities = [{ facilityId: '757' }];
      const result = createAfterCutoverFacilityNames(
        ohFacilities,
        mockEhrData,
        futureTransitionTable,
        mockGetNameFn,
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('id', '757');
      expect(result[0]).to.have.property(
        'content',
        'VA Central Ohio health care',
      );
    });
  });
});
