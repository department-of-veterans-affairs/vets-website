import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import {
  applicantWording,
  getAgeInYears,
  makeHumanReadable,
} from '../../../../shared/utilities';
import {
  isInRange,
  sponsorWording,
  populateFirstApplicant,
  page15aDepends,
} from '../../../helpers/utilities';
import {
  getErrorsForFiles,
  addLoadingMsg,
  filterToMatchingObjects,
  indexOfMatch,
  createFileObject,
} from '../../../../shared/utils/fileInputUtils';
import ApplicantField from '../../../../shared/components/applicantLists/ApplicantField';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';

/**
 * Tests for shared utilities (from ../../../../shared/utilities)
 */
describe('Shared Utilities', () => {
  describe('applicantWording helper', () => {
    it('should concatenate first and last names', () => {
      expect(
        applicantWording({
          applicantName: { first: 'Firstname', last: 'Lastname' },
        }),
      ).to.equal('Firstname Lastname’s');
    });
  });

  describe('getAgeInYears', () => {
    let clock;

    beforeEach(() => {
      // Mock Date.now() to always return a fixed value in 2024
      // (Similar to ReferralTaskCard.unit.spec.js)
      const fixedTimestamp = new Date('2024-12-31T00:00:00Z').getTime();
      clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should correctly calculate age in years', () => {
      const birthDate = '1990-07-01';
      const age = getAgeInYears(birthDate);
      expect(age).to.equal(34);
    });

    it('should correctly calculate age with a New Year’s Day birthdate', () => {
      const birthDate = '2000-01-01';
      const age = getAgeInYears(birthDate);
      expect(age).to.equal(24);
    });

    it('should correctly calculate age with a leap day birthdate', () => {
      const birthDate = '2004-02-29';
      const age = getAgeInYears(birthDate);
      expect(age).to.equal(20);
    });
  });

  describe('makeHumanReadable helper', () => {
    it('should convert camelCase into separate, capitalized words', () => {
      expect(makeHumanReadable('camelCaseTest')).to.equal('Camel Case Test');
    });
  });
});

/**
 * Tests for application-specific utilities (from ../../../helpers/utilities)
 */
describe('Application Utilities', () => {
  describe('sponsorWording helper', () => {
    it('should return non-possesive form when isPosessive == false', () => {
      expect(sponsorWording({}, false)).to.equal('Sponsor');
    });
  });

  describe('isInRange helper', () => {
    it('should return true if number in range', () => {
      expect(isInRange(22, 18, 23)).to.be.true;
    });

    it('should return false if number not in range', () => {
      expect(isInRange(25, 18, 23)).to.be.false;
    });
  });

  describe('populateFirstApplicant', () => {
    const newAppInfo = {
      name: { first: 'First', last: 'Last' },
      email: 'fake@va.gov',
      phone: '1231231234',
      address: { street: '123 st' },
    };

    it('Should add an applicant to the start of `formData.applicants` array', () => {
      const formData = { applicants: [{ applicantName: { first: 'Test' } }] };
      const result = populateFirstApplicant(
        formData,
        newAppInfo.name,
        newAppInfo.email,
        newAppInfo.phone,
        newAppInfo.address,
      );
      expect(result.applicants.length).to.equal(2);
      expect(result.applicants[0].applicantName.first).to.equal(
        newAppInfo.name.first,
      );
    });

    it('Should add the applicants array if it is undefined', () => {
      const formData = {};
      const result = populateFirstApplicant(
        formData,
        newAppInfo.name,
        newAppInfo.email,
        newAppInfo.phone,
        newAppInfo.address,
      );
      expect(result.applicants.length).to.equal(1);
    });
  });

  describe('page15a depends function', () => {
    const isApp = {
      certifierRole: 'applicant',
      certifierAddress: { street: '123' },
    };
    const notApp = {
      certifierRelationship: { relationshipToVeteran: { other: true } },
      certifierAddress: { street: '123' },
    };

    it('Should return false if certifier is an applicant and index is 0', () => {
      expect(page15aDepends(isApp, 0)).to.be.false;
    });

    it('Should return true if certifier is an applicant and index > 0', () => {
      expect(page15aDepends(isApp, 1)).to.be.true;
    });

    it('Should return true if certifier is NOT an applicant and index is 0', () => {
      expect(page15aDepends(notApp, 0)).to.be.true;
    });

    it('Should return true if certifier is NOT an applicant and index is > 0', () => {
      expect(page15aDepends(notApp, 0)).to.be.true;
    });
  });
});

/**
 * Tests for file handling utilities (from ../../../../shared/utils/fileInputUtils)
 */
describe('File Input Utilities', () => {
  describe('getErrorsForFiles function', () => {
    it('should match errors to files based on name and size', () => {
      // Setup test files
      const fileEvent = {
        detail: {
          state: [
            {
              file: { name: 'test1.pdf', size: 1024 },
            },
            {
              file: { name: 'test2.pdf', size: 2048 },
            },
            {
              file: { name: 'test3.pdf', size: 3072 },
            },
          ],
        },
      };

      // Setup error list
      const errorList = [
        { name: 'test2.pdf', size: 2048, errorMessage: 'Invalid file type' },
        { name: 'test3.pdf', size: 3072, errorMessage: 'File too large' },
      ];

      // Call the function
      const result = getErrorsForFiles(fileEvent, errorList);

      // Verify results
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.undefined; // No error for test1.pdf
      expect(result[1]).to.deep.equal({
        name: 'test2.pdf',
        size: 2048,
        errorMessage: 'Invalid file type',
      });
      expect(result[2]).to.deep.equal({
        name: 'test3.pdf',
        size: 3072,
        errorMessage: 'File too large',
      });
    });

    it('should return empty string when entry has no file', () => {
      const fileEvent = {
        detail: {
          state: [
            {}, // No file property
            { file: null },
            { file: { name: 'test.pdf', size: 1024 } },
          ],
        },
      };

      const errorList = [
        { name: 'test.pdf', size: 1024, errorMessage: 'Some error' },
      ];

      const result = getErrorsForFiles(fileEvent, errorList);

      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.equal('');
      expect(result[1]).to.equal('');
      expect(result[2]).to.deep.equal({
        name: 'test.pdf',
        size: 1024,
        errorMessage: 'Some error',
      });
    });

    it('should handle empty error list', () => {
      const fileEvent = {
        detail: {
          state: [
            { file: { name: 'test1.pdf', size: 1024 } },
            { file: { name: 'test2.pdf', size: 2048 } },
          ],
        },
      };

      const result = getErrorsForFiles(fileEvent, []);

      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.be.undefined;
      expect(result[1]).to.be.undefined;
    });
  });

  describe('addLoadingMsg function', () => {
    it('Should generate a loading error object with file details', () => {
      const result = addLoadingMsg(
        { name: 'file.png', size: 12345 },
        'arbitrary error string',
      );
      expect(result.name).to.equal('file.png');
      expect(result.size).to.equal(12345);
      expect(result.errorMessage).to.equal('arbitrary error string');
    });
  });

  describe('filterToMatchingObjects function', () => {
    it('should return items from second array that match items in first array by name and size', () => {
      const arr1 = [
        { name: 'file1.pdf', size: 1024 },
        { name: 'file2.pdf', size: 2048 },
        { name: 'file3.pdf', size: 3072 },
      ];

      const arr2 = [
        { name: 'file1.pdf', size: 1024, additionalProp: 'value1' },
        { name: 'file2.pdf', size: 2048, additionalProp: 'value2' },
        { name: 'file4.pdf', size: 4096, additionalProp: 'value4' },
      ];

      const result = filterToMatchingObjects(arr1, arr2);

      expect(result).to.have.lengthOf(2);
      expect(result[0].name).to.equal('file1.pdf');
      expect(result[0].size).to.equal(1024);
      expect(result[0].additionalProp).to.equal('value1');
      expect(result[1].name).to.equal('file2.pdf');
      expect(result[1].size).to.equal(2048);
      expect(result[1].additionalProp).to.equal('value2');
    });

    it('should return empty array when no matches exist', () => {
      const arr1 = [
        { name: 'file1.pdf', size: 1024 },
        { name: 'file2.pdf', size: 2048 },
      ];

      const arr2 = [
        { name: 'file3.pdf', size: 3072 },
        { name: 'file4.pdf', size: 4096 },
      ];

      const result = filterToMatchingObjects(arr1, arr2);

      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle objects with same name but different size', () => {
      const arr1 = [
        { name: 'file1.pdf', size: 1024 },
        { name: 'file2.pdf', size: 2048 },
      ];

      const arr2 = [
        { name: 'file1.pdf', size: 1024 }, // Match
        { name: 'file1.pdf', size: 5000 }, // Same name, different size
        { name: 'file2.pdf', size: 8000 }, // Same name, different size
      ];

      const result = filterToMatchingObjects(arr1, arr2);

      expect(result).to.have.lengthOf(1);
      expect(result[0].name).to.equal('file1.pdf');
      expect(result[0].size).to.equal(1024);
    });

    it('should handle empty input arrays', () => {
      // Empty first array should return empty result
      expect(
        filterToMatchingObjects([], [{ name: 'file.pdf', size: 1024 }]),
      ).to.be.an('array').that.is.empty;

      // Empty second array should return empty result
      expect(
        filterToMatchingObjects([{ name: 'file.pdf', size: 1024 }], []),
      ).to.be.an('array').that.is.empty;

      // Both empty arrays should return empty result
      expect(filterToMatchingObjects([], [])).to.be.an('array').that.is.empty;
    });
  });

  describe('indexOfMatch function', () => {
    it('should find the index of an object matching all specified properties', () => {
      const arr = [
        { name: 'file1.pdf', size: 1024, type: 'application/pdf' },
        { name: 'file2.pdf', size: 2048, type: 'application/pdf' },
        { name: 'file3.jpg', size: 512, type: 'image/jpeg' },
      ];

      // Test matching by single property
      expect(indexOfMatch(arr, { name: 'file2.pdf' })).to.equal(1);

      // Test matching by multiple properties
      expect(indexOfMatch(arr, { size: 512, type: 'image/jpeg' })).to.equal(2);

      // Test matching by all properties
      expect(
        indexOfMatch(arr, {
          name: 'file1.pdf',
          size: 1024,
          type: 'application/pdf',
        }),
      ).to.equal(0);
    });

    it('should return -1 when no match is found', () => {
      const arr = [
        { name: 'file1.pdf', size: 1024 },
        { name: 'file2.pdf', size: 2048 },
      ];

      // No match for name
      expect(indexOfMatch(arr, { name: 'file3.pdf' })).to.equal(-1);

      // No match for combination of properties
      expect(indexOfMatch(arr, { name: 'file1.pdf', size: 2048 })).to.equal(-1);
    });

    it('should handle empty array', () => {
      expect(indexOfMatch([], { name: 'file.pdf' })).to.equal(-1);
    });

    it('should handle empty properties object', () => {
      const arr = [
        { name: 'file1.pdf', size: 1024 },
        { name: 'file2.pdf', size: 2048 },
      ];

      // An empty properties object means "match everything" - should return index 0
      expect(indexOfMatch(arr, {})).to.equal(0);
    });
  });

  describe('createFileObject function', () => {
    let originalCreateObjectURL;

    beforeEach(() => {
      // Mock URL.createObjectURL
      originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = sinon.stub().returns('blob:mock-url');
    });

    afterEach(() => {
      // Restore original method
      URL.createObjectURL = originalCreateObjectURL;
    });

    it('should create a file object with the correct properties', () => {
      const mockFile = {
        file: {
          lastModified: 1622345678,
          lastModifiedDate: new Date('2021-05-30'),
          type: 'application/pdf',
        },
        name: 'test-file.pdf',
        size: 12345,
        warnings: ['Warning message'],
        confirmationCode: 'ABC123',
        isEncrypted: true,
      };

      const result = createFileObject(mockFile);

      // Check that the function extracted the right properties
      expect(result.lastModified).to.equal(1622345678);
      expect(result.lastModifiedDate).to.deep.equal(new Date('2021-05-30'));
      expect(result.type).to.equal('application/pdf');
      expect(result.name).to.equal('test-file.pdf');
      expect(result.size).to.equal(12345);
      expect(result.warnings).to.deep.equal(['Warning message']);
      expect(result.confirmationCode).to.equal('ABC123');
      expect(result.isEncrypted).to.be.true;
      expect(result.localFilePath).to.equal('blob:mock-url');
    });

    it('should handle files without optional properties', () => {
      // Create a minimal file object with just required properties
      const minimalFile = {
        file: {
          lastModified: 1622345678,
          lastModifiedDate: null,
          type: 'image/jpeg',
        },
        name: 'minimal.jpg',
        size: 500,
      };

      const result = createFileObject(minimalFile);

      // Check required properties
      expect(result.lastModified).to.equal(1622345678);
      expect(result.type).to.equal('image/jpeg');
      expect(result.name).to.equal('minimal.jpg');
      expect(result.size).to.equal(500);

      // Optional properties should be undefined
      expect(result.lastModifiedDate).to.be.null;
      expect(result.warnings).to.be.undefined;
      expect(result.confirmationCode).to.be.undefined;
      expect(result.isEncrypted).to.be.undefined;

      // localFilePath should always be set
      expect(result.localFilePath).to.equal('blob:mock-url');
    });

    it('should create object URL from the file', () => {
      const mockFile = {
        file: {
          type: 'text/plain',
        },
        name: 'test.txt',
        size: 100,
      };

      createFileObject(mockFile);

      // Verify createObjectURL was called with the file
      expect(URL.createObjectURL.calledOnce).to.be.true;
      expect(URL.createObjectURL.calledWith(mockFile.file)).to.be.true;
    });
  });
});

/**
 * Tests for React components
 */
describe('React Components', () => {
  describe('ApplicantField', () => {
    it('should render correctly', () => {
      testComponentRender(
        'ApplicantField',
        <ApplicantField formData={mockData.data.applicants[0]} />,
      );
    });
  });
});
