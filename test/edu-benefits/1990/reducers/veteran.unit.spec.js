import { expect } from 'chai';

import veteranReducer from '../../../../src/js/edu-benefits/1990/reducers/veteran/index';
import { VETERAN_FIELD_UPDATE, ENSURE_FIELDS_INITIALIZED } from '../../../../src/js/edu-benefits/1990/actions/index';

describe('veteran reducer', () => {
  it('should update a field', () => {
    const veteran = {
      field: {
        dirty: false,
        value: 3
      }
    };
    const newState = veteranReducer(veteran, { type: VETERAN_FIELD_UPDATE, propertyPath: 'field.value', value: 5 });
    expect(newState.field.value).to.equal(5);
  });
  it('should initialize all fields', () => {
    const veteran = {
      field1: {
        dirty: false,
        value: 3
      },
      field2: {
        dirty: false,
        value: 3
      }
    };
    const newState = veteranReducer(veteran, { type: ENSURE_FIELDS_INITIALIZED, fields: ['field1', 'field2'] });
    expect(newState.field1.dirty).to.be.true;
    expect(newState.field2.dirty).to.be.true;
  });
  it('should initialize all fields in a parent', () => {
    const veteran = {
      list: [
        {
          field1: {
            dirty: false,
            value: 3
          },
          field2: {
            dirty: false,
            value: 3
          }
        },
        {
          field1: {
            dirty: false,
            value: 3
          },
          field2: {
            dirty: false,
            value: 3
          }
        }
      ]
    };
    const newState = veteranReducer(veteran, { type: ENSURE_FIELDS_INITIALIZED, fields: ['field1', 'field2'], parentNode: 'list' });
    newState.list.forEach(item => {
      expect(item.field1.dirty).to.be.true;
      expect(item.field2.dirty).to.be.true;
    });
  });
});
