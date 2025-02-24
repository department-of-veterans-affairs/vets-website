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
    expect(data).to.eq('FORM_DATA_NOT_FOUND');

    data = getFormDataFromSchemaId('root_first', formData);
    expect(data).to.eq('FORM_DATA_NOT_FOUND');
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

  it('should correctly get properties with strange names', async () => {
    const formData = {
      test: {
        'test-1': 'test 1',
        'test 2': 'test 2',
        TEST_3: 'test 3',
        'test.4': 'test 4',
        'test:5': 'test 5',
        'view:test-6': 'test 6',
      },
    };

    let data = getFormDataFromSchemaId('root_test_test-1', formData);
    expect(data).to.be.eq('test 1');
    data = getFormDataFromSchemaId('root_test_test 2', formData);
    expect(data).to.be.eq('test 2');
    data = getFormDataFromSchemaId('root_test_test2', formData);
    expect(data).to.be.eq('FORM_DATA_NOT_FOUND');
    data = getFormDataFromSchemaId('root_test_test_2', formData);
    expect(data).to.be.eq('FORM_DATA_NOT_FOUND');
    data = getFormDataFromSchemaId('root_test_TEST_3', formData);
    expect(data).to.be.eq('FORM_DATA_NOT_FOUND');
    data = getFormDataFromSchemaId('root_test_test.4', formData);
    expect(data).to.be.eq('test 4');
    data = getFormDataFromSchemaId('root_test_test:5', formData);
    expect(data).to.be.eq('test 5');
    data = getFormDataFromSchemaId('root_test_view:test-6', formData);
    expect(data).to.be.eq('test 6');
  });
});
