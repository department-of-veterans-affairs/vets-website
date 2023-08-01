import { expect } from 'chai';
import getFormDataFromSchemaId from '../../../src/js/utilities/data/getFormDataFromSchemaId';

describe('getFormDataFromSchemaId tests', () => {
  it('finds the correct formData for given schemaId', async () => {
    const formData = {
      fullName: {
        first: 'John',
      },
    };

    let data = getFormDataFromSchemaId('root_fullName', formData);
    expect(data).to.be.an('object');

    data = getFormDataFromSchemaId('root_fullName_first', formData);
    expect(data).to.eq('John');
  });

  it('cannot find an field that is not in the formData', async () => {
    const formData = {
      fullName: {
        first: 'John',
      },
    };

    let data = getFormDataFromSchemaId('root_apple', formData);
    expect(data).to.be.undefined;

    data = getFormDataFromSchemaId('root_first', formData);
    expect(data).to.be.undefined;
  });

  it('"root" just refers to the formData, but there is no property "root"', async () => {
    const formData = {
      fullName: {
        first: 'John',
      },
    };

    const data = getFormDataFromSchemaId('root', formData);
    expect(data).to.be.an('object');
  });

  it('should find data in arrays', async () => {
    const formData = {
      arrayExample: [
        {
          facilityName: 'facilities_1',
          from: '1999-01-01',
          to: '2000-01-02',
        },
        {
          facilityName: 'facilities_2',
          from: '2001-01-01',
          to: '2002-02-03',
        },
      ],
    };

    let data = getFormDataFromSchemaId(
      'root_arrayExample_0_facilityName',
      formData,
    );
    expect(data).to.be.eq('facilities_1');

    data = getFormDataFromSchemaId('root_arrayExample_0', formData);
    expect(data).to.be.an('object');
  });

  it('should not find data with empty form data', async () => {
    let formData = null;

    let data = getFormDataFromSchemaId('root', formData);
    expect(data).to.be.undefined;

    formData = {};

    data = getFormDataFromSchemaId('root', formData);
    expect(data).to.be.an('object');
  });
});
