import { expect } from 'chai';
import viewifyFields from '../../../src/js/utilities/viewify-fields';

describe('viewifyFields', () => {
  const formData = {
    prop1: {
      'view:nestedProp': {
        anotherNestedProp: 'value',
        'view:doubleView': 'whoa, man--it’s like inception',
      },
      siblingProp: 'another value',
    },
    'view:prop2': 'this is a string',
  };

  it('should prefix all the property names with "view:" if needed', () => {
    const viewifiedFormData = {
      'view:prop1': {
        'view:nestedProp': {
          'view:anotherNestedProp': 'value',
          'view:doubleView': 'whoa, man--it’s like inception',
        },
        'view:siblingProp': 'another value',
      },
      'view:prop2': 'this is a string',
    };
    expect(viewifyFields(formData)).to.eql(viewifiedFormData);
  });
});
