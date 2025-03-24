import { expect } from 'chai';
import {
  getDataFromPath,
  adaptFormData,
} from '../../../../src/js/components/PersonalInformation/adapter';

describe('getDataFromPath', () => {
  const testData = {
    shallow: 'value',
    nested: {
      field: 'nestedValue',
      deepNested: {
        field: 'deepValue',
      },
    },
  };

  it('should return null when path is empty-ish', () => {
    expect(getDataFromPath(testData, '')).to.be.null;
    expect(getDataFromPath(testData, null)).to.be.null;
    expect(getDataFromPath(testData, undefined)).to.be.null;
  });

  it('should return null when path does not exist', () => {
    expect(getDataFromPath(testData, 'nonexistent')).to.be.null;
    expect(getDataFromPath(testData, 'nested.nonexistent')).to.be.null;
  });

  it('should return value for shallow/single-depth path when it exists', () => {
    expect(getDataFromPath(testData, 'shallow')).to.equal('value');
  });

  it('should return value for nested/multi-depth path when it exists', () => {
    expect(getDataFromPath(testData, 'nested.field')).to.equal('nestedValue');
    expect(getDataFromPath(testData, 'nested.deepNested.field')).to.equal(
      'deepValue',
    );
  });
});

describe('adaptFormData', () => {
  it('should use default paths when no adapter is provided', () => {
    const formData = {
      ssn: '1234',
      vaFileNumber: '5678',
    };

    const result = adaptFormData(formData);
    expect(result).to.deep.equal({
      ssn: '1234',
      vaFileLastFour: '5678',
    });
  });

  it('should use custom paths from adapter', () => {
    const formData = {
      veteran: {
        ssnNested: '7890',
        vaFileNumberNested: '8901',
      },
    };

    const adapter = {
      ssnPath: 'veteran.ssnNested',
      vaFileNumberPath: 'veteran.vaFileNumberNested',
    };

    const result = adaptFormData(formData, adapter);
    expect(result).to.deep.equal({
      ssn: '7890',
      vaFileLastFour: '8901',
    });
  });

  it('should handle missing data with null values', () => {
    const formData = {
      veteran: {
        ssnNested: '7890',
      },
    };

    const adapter = {
      ssnPath: 'veteran.ssnNested',
      vaFileNumberPath: 'veteran.vaFileNumberNested',
    };

    const result = adaptFormData(formData, adapter);
    expect(result).to.deep.equal({
      ssn: '7890',
      vaFileLastFour: null,
    });
  });

  it('should handle empty form data', () => {
    // maybe we should throw and error in this case?
    // seems like something that shouldn't ever happen
    const result = adaptFormData({});
    expect(result).to.deep.equal({
      ssn: null,
      vaFileLastFour: null,
    });
  });

  it('should override only specified adapter paths', () => {
    // this way we can use the default paths for the rest of the fields
    // and only override the ones we need to provide a custom path for
    const formData = {
      ssn: '1234',
      veteran: {
        vaFileNumberNested: '5678',
      },
    };

    const adapter = {
      vaFileNumberPath: 'veteran.vaFileNumberNested',
    };

    const result = adaptFormData(formData, adapter);
    expect(result).to.deep.equal({
      ssn: '1234',
      vaFileLastFour: '5678',
    });
  });
});
