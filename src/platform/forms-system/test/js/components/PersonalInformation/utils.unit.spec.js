import { expect } from 'chai';
import React from 'react';
import { isValid } from 'date-fns';
import {
  getMissingData,
  parseDateToDateObj,
  getChildrenByType,
  FORMAT_YMD_DATE_FNS,
} from '../../../../src/js/components/PersonalInformation/utils';
import {
  PersonalInformationHeader,
  PersonalInformationNote,
  PersonalInformationFooter,
} from '../../../../src/js/components/PersonalInformation/PersonalInformation';

describe('getMissingData', () => {
  const mockData = {
    userFullName: {
      first: 'John',
      last: 'Doe',
    },
    ssn: '1234',
    vaFileLastFour: '5678',
    dob: '1990-01-01',
    gender: 'M',
  };

  it('should return empty array when all field data is present', () => {
    const config = {
      name: { show: true, required: true },
      ssn: { show: true, required: true },
      vaFileNumber: { show: true, required: true },
      dateOfBirth: { show: true, required: true },
      gender: { show: true, required: true },
    };

    const result = getMissingData(mockData, config);
    expect(result).to.deep.equal([]);
  });

  it('should handle a missing name', () => {
    const dataWithoutName = {
      ...mockData,
      userFullName: {},
    };

    const result = getMissingData(dataWithoutName, {
      name: { show: true, required: true },
    });
    expect(result).to.include('name');
  });

  it('should not check fields set to required: false in config', () => {
    const incompleteData = {
      userFullName: { first: 'John', last: 'Doe' },
    };

    const config = {
      name: { show: true, required: true },
      ssn: { show: false, required: false },
      vaFileNumber: { show: false, required: false },
      dateOfBirth: { show: false, required: false },
      gender: { show: false, required: false },
    };

    const result = getMissingData(incompleteData, config);
    expect(result).to.deep.equal([]);
  });

  it('should handle name data with missing parts', () => {
    const partialNameData = {
      userFullName: { first: 'John' },
    };

    const result = getMissingData(partialNameData, {
      name: { show: true, required: true },
    });
    // As long as one part is present, it should pass
    // maybe this should be changed to check for at least one first or last name so just a suffix would fail?
    expect(result).to.not.include('name');
  });
});

describe('parseDateToDateObj', () => {
  it('should work for ISO8601 date strings', () => {
    const dateStr = '2023-01-01T00:00:00Z';
    const result = parseDateToDateObj(dateStr);
    expect(isValid(result)).to.be.true;
    expect(result.getFullYear()).to.equal(2023);
    expect(result.getMonth()).to.equal(0); // Jan is 0
    expect(result.getDate()).to.equal(1);
  });

  it('should parse date string with template used in profile state', () => {
    const dateStr = '2023-01-01';
    const result = parseDateToDateObj(dateStr, FORMAT_YMD_DATE_FNS);
    expect(isValid(result)).to.be.true;
    expect(result.getFullYear()).to.equal(2023);
    expect(result.getMonth()).to.equal(0);
    expect(result.getDate()).to.equal(1);
  });

  it('should handle invalid dates', () => {
    const invalidDate = 'not-a-date';
    const result = parseDateToDateObj(invalidDate);
    expect(result).to.be.null;
  });

  it('should work with Date objects', () => {
    const dateObj = new Date(2023, 0, 1); // Jan 1, 2023
    const result = parseDateToDateObj(dateObj);
    expect(isValid(result)).to.be.true;
    expect(result.getFullYear()).to.equal(2023);
    expect(result.getMonth()).to.equal(0);
    expect(result.getDate()).to.equal(1);
  });

  it('should handle null and undefined', () => {
    expect(parseDateToDateObj(null)).to.be.null;
    expect(parseDateToDateObj(undefined)).to.be.null;
  });
});

describe('getChildrenByType', () => {
  it('should correctly categorize children by type', () => {
    const children = [
      <PersonalInformationHeader key="0">
        Header Content
      </PersonalInformationHeader>,
      <PersonalInformationNote key="1">Note Content</PersonalInformationNote>,
      <PersonalInformationFooter key="2">
        Footer Content
      </PersonalInformationFooter>,
    ];

    const result = getChildrenByType(children);
    expect(result.header).to.exist;
    expect(result.note).to.exist;
    expect(result.footer).to.exist;
  });

  it('should handle missing children types', () => {
    const children = [
      <PersonalInformationHeader key="header">
        Header Content
      </PersonalInformationHeader>,
    ];

    const result = getChildrenByType(children);

    expect(result.header).to.exist;
    expect(result.note).to.be.null;
    expect(result.footer).to.be.null;
  });

  it('should handle null or undefined children', () => {
    const children = [
      null,
      undefined,
      <PersonalInformationHeader key="header">
        Header Content
      </PersonalInformationHeader>,
    ];

    const result = getChildrenByType(children);

    expect(result.header).to.exist;
    expect(result.note).to.be.null;
    expect(result.footer).to.be.null;
  });
});
