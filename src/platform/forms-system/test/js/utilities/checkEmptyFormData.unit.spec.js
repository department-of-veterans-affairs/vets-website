import { expect } from 'chai';
import checkEmptyFormData from '../../../src/js/utilities/data/checkEmptyFormData';

describe('checkEmptyFormData tests', () => {
  it('finds the correct formData for given schemaId', async () => {
    const formData = {
      fullName: {
        first: 'John',
      },
    };

    let { isEmpty, hasProperty } = checkEmptyFormData(
      'root_fullName',
      formData,
    );
    expect(isEmpty).to.be.false;
    expect(hasProperty).to.be.true;

    ({ isEmpty, hasProperty } = checkEmptyFormData(
      'root_fullName_first',
      formData,
    ));

    expect(isEmpty).to.be.false;
    expect(hasProperty).to.be.true;
  });

  it('cannot find an field that is not in the formData', async () => {
    const formData = {
      fullName: {
        first: 'John',
      },
    };

    let { isEmpty, hasProperty } = checkEmptyFormData('root_apple', formData);
    expect(isEmpty).to.be.true;
    expect(hasProperty).to.be.false;

    ({ isEmpty, hasProperty } = checkEmptyFormData('root_first', formData));
    expect(isEmpty).to.be.true;
    expect(hasProperty).to.be.false;
  });

  it('"root" just refers to the formData, but there is no property "root"', async () => {
    const formData = {
      fullName: {
        first: 'John',
      },
    };

    const { isEmpty, hasProperty } = checkEmptyFormData('root', formData);
    expect(isEmpty).to.be.false;
    expect(hasProperty).to.be.false;
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

    let { isEmpty, hasProperty } = checkEmptyFormData(
      'root_arrayExample_0_facilityName',
      formData,
    );
    expect(isEmpty).to.be.false;
    expect(hasProperty).to.be.true;

    ({ isEmpty, hasProperty } = checkEmptyFormData(
      'root_arrayExample_0',
      formData,
    ));
    expect(isEmpty).to.be.false;
    expect(hasProperty).to.be.true;
  });

  it('should not find data with empty form data', async () => {
    let formData = null;

    let { isEmpty, hasProperty } = checkEmptyFormData('root', formData);
    expect(isEmpty).to.be.true;
    expect(hasProperty).to.be.false;

    formData = {};

    ({ isEmpty, hasProperty } = checkEmptyFormData('root', formData));
    expect(isEmpty).to.be.false;
    expect(hasProperty).to.be.false;
  });
});
