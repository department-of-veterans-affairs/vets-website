import { expect } from 'chai';

import {
  processArrayData,
  getItemDataFromPath,
  getItemDuplicateDismissedName,
  getArrayDataFromDuplicateChecks,
  checkIfArrayHasDuplicateData,
} from '../helpers';

describe('Array Builder Helpers', () => {
  const itemData = {
    items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
  };
  const itemDuplicateChecks = (comparisonType = 'all') => ({
    comparisonType,
    comparisons: ['id', 'name'],
    externalComparisonData: () => [[3, 'Item 3']],
  });

  const peopleData = {
    people: [
      {
        data: {
          ssn: 123456789,
          fullName: { first: 'John', last: 'Doe' },
          dob: '1990-01-01',
        },
      },
      {
        data: {
          ssn: 987654321,
          fullName: { first: 'Jane', last: 'Doe' },
          dob: '2000-01-01',
        },
      },
      {
        data: {
          ssn: 456789123,
          fullName: { first: 'Fred', last: 'Doe' },
          dob: '2020-01-01',
        },
      },
      {
        data: {
          ssn: 123456789,
          fullName: { first: 'John', last: 'Doe' },
          dob: '1990-01-01',
        },
      },
    ],
  };
  const peopleDuplicateChecks = (comparisonType = 'all') => ({
    comparisonType,
    comparisons: [
      'data.ssn',
      'data.fullName.first',
      'data.fullName.last',
      'data.dob',
    ],
    externalComparisonData: () => [[456789123, 'Fred', 'Doe', '2020-01-01']],
  });

  context('processArrayData', () => {
    it('should process array data correctly', () => {
      const result = processArrayData(['ITEM1', 'ITEM2', 'ITEM3']);
      expect(result).to.deep.equal('item1;item2;item3');
    });
    it('should process array data with spaces correctly', () => {
      const result = processArrayData(['ITEM 1', 'ITEM  2', 'ITEM   3']);
      expect(result).to.deep.equal('item-1;item--2;item---3');
    });
    it('should throw an error when a non-array value is passed in', () => {
      const value = { test: true };
      expect(() => processArrayData(value)).to.throw(
        'Processing array data requires an array',
      );
    });
  });

  context('getItemDataFromPath', () => {
    it('should return the correct item data for a valid path', () => {
      const result = getItemDataFromPath({
        arrayPath: 'items',
        duplicateChecks: itemDuplicateChecks(),
        itemIndex: 1,
        fullData: itemData,
      });
      expect(result).to.eq('2;item-2');
    });

    it('should return correct data for deeper paths', () => {
      const result = getItemDataFromPath({
        arrayPath: 'people',
        duplicateChecks: peopleDuplicateChecks(),
        itemIndex: 1,
        fullData: peopleData,
      });
      expect(result).to.eq('987654321;jane;doe;2000-01-01');
    });
  });

  context('getItemDuplicateDismissedName', () => {
    it('should return the dismissed name for a duplicate item', () => {
      const result = getItemDuplicateDismissedName({
        arrayPath: 'items',
        duplicateChecks: itemDuplicateChecks(),
        itemIndex: 0,
        fullData: itemData,
      });
      expect(result).to.eq('items;1;item-1;allowDuplicate');
    });

    it('should return the dismissed name for a duplicate people', () => {
      const result = getItemDuplicateDismissedName({
        arrayPath: 'people',
        duplicateChecks: peopleDuplicateChecks(),
        itemIndex: 0,
        fullData: peopleData,
      });
      expect(result).to.eq(
        'people;123456789;john;doe;1990-01-01;allowDuplicate',
      );
    });
  });

  context('getArrayDataFromDuplicateChecks', () => {
    it('should return correct array data & length for items', () => {
      const result = getArrayDataFromDuplicateChecks({
        arrayPath: 'items',
        duplicateChecks: itemDuplicateChecks(),
        fullData: itemData,
      });
      expect(result).to.deep.equal(['1;item-1', '2;item-2']);
    });

    it('should return correct array data & length for people', () => {
      const result = getArrayDataFromDuplicateChecks({
        arrayPath: 'people',
        duplicateChecks: peopleDuplicateChecks(),
        fullData: peopleData,
      });
      expect(result).to.deep.equal([
        '123456789;john;doe;1990-01-01',
        '987654321;jane;doe;2000-01-01',
        '456789123;fred;doe;2020-01-01',
        '123456789;john;doe;1990-01-01',
      ]);
    });
  });

  context('checkIfArrayHasDuplicateData', () => {
    it('should return no duplicates for unique items', () => {
      const result = checkIfArrayHasDuplicateData({
        arrayPath: 'items',
        duplicateChecks: itemDuplicateChecks(),
        fullData: itemData,
      });
      expect(result).to.deep.equal({
        hasDuplicate: false,
        duplicates: [],
        externalComparisonData: [[3, 'Item 3']],
        arrayData: ['1;item-1', '2;item-2'],
      });
    });

    it('should find duplicates in internal & external data', () => {
      const result = checkIfArrayHasDuplicateData({
        arrayPath: 'people',
        duplicateChecks: peopleDuplicateChecks(),
        fullData: peopleData,
      });
      expect(result).to.deep.equal({
        hasDuplicate: true,
        duplicates: [
          '123456789;john;doe;1990-01-01',
          '456789123;fred;doe;2020-01-01',
        ],
        externalComparisonData: [[456789123, 'Fred', 'Doe', '2020-01-01']],
        arrayData: [
          '123456789;john;doe;1990-01-01',
          '987654321;jane;doe;2000-01-01',
          '456789123;fred;doe;2020-01-01',
          '123456789;john;doe;1990-01-01',
        ],
      });
    });

    it('should find duplicates from internal-only people data', () => {
      const result = checkIfArrayHasDuplicateData({
        arrayPath: 'people',
        duplicateChecks: {
          ...peopleDuplicateChecks('internal'),
          externalComparisonData: () => [
            ['456789123', 'FRED', 'DOE', '2020-01-01'],
            ['456789123', 'MARY', 'DOE', '2020-01-01'],
          ],
        },
        fullData: peopleData,
      });
      expect(result).to.deep.equal({
        hasDuplicate: true,
        duplicates: ['123456789;john;doe;1990-01-01'],
        externalComparisonData: [], // ignored, so not returned
        arrayData: [
          '123456789;john;doe;1990-01-01',
          '987654321;jane;doe;2000-01-01',
          '456789123;fred;doe;2020-01-01',
          '123456789;john;doe;1990-01-01',
        ],
      });
    });

    it('should find duplicates from external-only people data', () => {
      const result = checkIfArrayHasDuplicateData({
        arrayPath: 'people',
        duplicateChecks: {
          ...peopleDuplicateChecks('external'),
          externalComparisonData: () => [
            ['456789123', 'FRED', 'DOE', '2020-01-01'],
            ['456789123', 'MARY', 'DOE', '2020-01-01'],
          ],
        },
        fullData: peopleData,
      });
      expect(result).to.deep.equal({
        hasDuplicate: true,
        duplicates: ['456789123;fred;doe;2020-01-01'],
        externalComparisonData: [
          ['456789123', 'FRED', 'DOE', '2020-01-01'],
          ['456789123', 'MARY', 'DOE', '2020-01-01'],
        ],
        arrayData: [
          '123456789;john;doe;1990-01-01',
          '987654321;jane;doe;2000-01-01',
          '456789123;fred;doe;2020-01-01',
          '123456789;john;doe;1990-01-01',
        ],
      });
    });

    it('should not find duplicates from external people data', () => {
      const result = checkIfArrayHasDuplicateData({
        arrayPath: 'people',
        duplicateChecks: {
          ...peopleDuplicateChecks(),
          externalComparisonData: () => [
            ['456789123', 'MAX', 'DOE', '2020-01-01'],
            ['456789123', 'MARY', 'DOE', '2020-01-01'],
          ],
        },
        fullData: { people: peopleData.people.slice(0, 3) },
      });
      expect(result).to.deep.equal({
        hasDuplicate: false,
        duplicates: [],
        externalComparisonData: [
          ['456789123', 'MAX', 'DOE', '2020-01-01'],
          ['456789123', 'MARY', 'DOE', '2020-01-01'],
        ],
        arrayData: [
          '123456789;john;doe;1990-01-01',
          '987654321;jane;doe;2000-01-01',
          '456789123;fred;doe;2020-01-01',
        ],
      });
    });
  });
});
