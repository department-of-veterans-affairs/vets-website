import { expect } from 'chai';

import {
  parseISODate,
  formatISOPartialDate,
  updateRequiredFields,
  createRoutes,
  hasFieldsOtherThanArray,
  transformForSubmit,
  setHiddenFields,
  removeHiddenData,
  updateSchemaFromUiSchema,
  getArrayFields
} from '../../../src/js/common/schemaform/helpers';

describe('Schemaform helpers:', () => {
  describe('parseISODate', () => {
    it('should parse an ISO date', () => {
      expect(parseISODate('2001-02-03')).to.eql({ month: '2', day: '3', year: '2001' });
    });
    it('should parse a partial ISO date', () => {
      expect(parseISODate('XXXX-02-03')).to.eql({ month: '2', day: '3', year: '' });
      expect(parseISODate('2003-XX-03')).to.eql({ month: '', day: '3', year: '2003' });
    });
  });
  describe('formatISOPartialDate', () => {
    it('should format a regular date', () => {
      const date = {
        month: '3',
        day: '29',
        year: '2005'
      };
      expect(formatISOPartialDate(date)).to.equal('2005-03-29');
    });
    it('should format a partial date', () => {
      const date = {
        month: '2',
        day: '',
        year: '2005'
      };
      expect(formatISOPartialDate(date)).to.equal('2005-02-XX');
    });
    it('should format an empty date as undefined', () => {
      const date = {
        month: '',
        day: '',
        year: ''
      };
      expect(formatISOPartialDate(date)).to.be.undefined;
    });
  });
  describe('updateRequiredFields', () => {
    it('should add field to required array', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      };
      const uiSchema = {
        test: {
          'ui:required': () => true
        }
      };
      expect(updateRequiredFields(schema, uiSchema).required[0]).to.equal('test');
    });
    it('should remove field from required array', () => {
      const schema = {
        type: 'object',
        required: ['test'],
        properties: {
          test: {
            type: 'string'
          }
        }
      };
      const uiSchema = {
        test: {
          'ui:required': () => false
        }
      };
      expect(updateRequiredFields(schema, uiSchema).required).to.be.empty;
    });
    it('should not change schema if required does not change', () => {
      const schema = {
        type: 'object',
        required: ['test'],
        properties: {
          test: {
            type: 'string'
          }
        }
      };
      const uiSchema = {
        test: {
          'ui:required': () => true
        }
      };
      expect(updateRequiredFields(schema, uiSchema)).to.equal(schema);
    });
    it('should set required in arrays', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            test: {
              type: 'string'
            }
          }
        }
      };
      const uiSchema = {
        items: {
          test: {
            'ui:required': () => true
          }
        }
      };
      expect(updateRequiredFields(schema, uiSchema).items.required[0]).to.equal('test');
    });
  });
  describe('createRoutes', () => {
    it('should create routes', () => {
      const formConfig = {
        chapters: {
          firstChapter: {
            pages: {
              testPage: {
                path: 'test-page'
              }
            }
          }
        }
      };

      const routes = createRoutes(formConfig);

      expect(routes[0].path).to.equal('test-page');
      expect(routes[1].path).to.equal('review-and-submit');
    });
    it('should create routes with intro', () => {
      const formConfig = {
        introduction: f => f,
        chapters: {
          firstChapter: {
            pages: {
              testPage: {
                path: 'test-page'
              }
            }
          }
        }
      };

      const routes = createRoutes(formConfig);

      expect(routes[0].path).to.equal('introduction');
    });
  });
  describe('hasFieldsOtherThanArray', () => {
    it('should return true if non-array fields', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'array'
          },
          test2: {
            type: 'string'
          }
        }
      };

      expect(hasFieldsOtherThanArray(schema)).to.be.true;
    });
    it('should return true if nested non-array fields', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'array'
          },
          test2: {
            type: 'object',
            properties: {
              test3: {
                type: 'number'
              }
            }
          }
        }
      };

      expect(hasFieldsOtherThanArray(schema)).to.be.true;
    });
    it('should return false if only array fields', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                test: {
                  type: 'string'
                }
              }
            }
          }
        }
      };

      expect(hasFieldsOtherThanArray(schema)).to.be.false;
    });
  });
  describe('setHiddenFields', () => {
    it('should set field as hidden', () => {
      const schema = {};
      const uiSchema = {
        'ui:options': {
          hideIf: () => true
        }
      };
      const data = {};

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema['ui:hidden']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should not touch non-hidden field without prop', () => {
      const schema = {};
      const uiSchema = {
        'ui:options': {
          hideIf: () => false
        }
      };
      const data = {};

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema['ui:hidden']).to.be.undefined;
      expect(newSchema).to.equal(schema);
    });
    it('should remove hidden prop from schema', () => {
      const schema = {
        'ui:hidden': true
      };
      const uiSchema = {
        'ui:options': {
          hideIf: () => false
        }
      };
      const data = {};

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema['ui:hidden']).to.be.undefined;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set hidden on object field', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {}
        }
      };
      const uiSchema = {
        field: {
          'ui:options': {
            hideIf: () => true
          }
        }
      };
      const data = { field: '' };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.field['ui:hidden']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set hidden on array field', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {}
          }
        }
      };
      const uiSchema = {
        items: {
          field: {
            'ui:options': {
              hideIf: () => true
            }
          }
        }
      };
      const data = [];

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema).not.to.equal(schema);
      expect(newSchema.items.properties.field['ui:hidden']).to.be.true;
    });
  });
  describe('removeHiddenData', () => {
    it('should remove hidden field', () => {
      const schema = {
        'ui:hidden': true
      };
      const data = 'test';

      const newData = removeHiddenData(schema, data);

      expect(newData).to.be.undefined;
    });
    it('should remove hidden field in object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {
            'ui:hidden': true
          }
        }
      };
      const data = { field: 'test', field2: 'test2' };

      const newData = removeHiddenData(schema, data);

      expect(newData).to.eql({ field: 'test' });
    });
    it('should remove hidden field in array', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {},
            field2: {
              'ui:hidden': true
            }
          }
        }
      };
      const data = [{ field: 'test', field2: 'test2' }];

      const newData = removeHiddenData(schema, data);

      expect(newData[0]).to.eql({ field: 'test' });
    });
  });
  describe('updateSchemaFromUiSchema', () => {
    it('should update schema', () => {
      const schema = {
        type: 'string'
      };
      const uiSchema = {
        'ui:options': {
          updateSchema: () => {
            return { type: 'number' };
          }
        }
      };
      const data = 'test';
      const formData = {};

      const newSchema = updateSchemaFromUiSchema(schema, uiSchema, data, formData);

      expect(newSchema).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should update schema in object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {
            type: 'string'
          }
        }
      };
      const uiSchema = {
        field: {
          'ui:options': {
            updateSchema: () => {
              return { type: 'number' };
            }
          }
        }
      };
      const data = {};
      const formData = {};

      const newSchema = updateSchemaFromUiSchema(schema, uiSchema, data, formData);

      expect(newSchema.properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should update schema in array', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string'
            }
          }
        }
      };
      const uiSchema = {
        items: {
          field: {
            'ui:options': {
              updateSchema: () => {
                return { type: 'number' };
              }
            }
          }
        }
      };
      const data = [{}];
      const formData = {};

      const newSchema = updateSchemaFromUiSchema(schema, uiSchema, data, formData);

      expect(newSchema.items.properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
  });
  describe('getArrayFields', () => {
    it('should get array', () => {
      const data = {
        schema: {
          type: 'array'
        },
        uiSchema: {}
      };

      const fields = getArrayFields(data);

      expect(fields).not.to.be.empty;
    });
    it('should get array in object', () => {
      const data = {
        schema: {
          type: 'object',
          properties: {
            field: {
              type: 'array'
            }
          }
        },
        uiSchema: {}
      };

      const fields = getArrayFields(data);

      expect(fields).not.to.be.empty;
      expect(fields[0].path).to.eql(['field']);
    });
  });
  describe('transformForSubmit', () => {
    it('should flatten page data within chapter', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
              page2: {}
            }
          }
        }
      };
      const formData = {
        page1: {
          data: {
            otherField: 'testing2'
          }
        },
        page2: {
          data: {
            field: 'testing'
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        otherField: 'testing2',
        field: 'testing'
      });
    });
    it('should flatten page data across chapters', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            }
          },
          chapter2: {
            pages: {
              page2: {}
            }
          }
        }
      };
      const formData = {
        page1: {
          data: {
            otherField: 'testing2'
          }
        },
        page2: {
          data: {
            field: 'testing'
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        otherField: 'testing2',
        field: 'testing'
      });
    });
    it('should remove view fields', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {}
            }
          }
        }
      };
      const formData = {
        page1: {
          data: {
            'view:Test': 'thing'
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output['view:Test']).to.be.undefined;
    });
    it('should flatten view objects', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {}
            }
          }
        }
      };
      const formData = {
        page1: {
          data: {
            'view:Test': {
              field: 'testing'
            }
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output['view:Test']).to.be.undefined;
      expect(output).to.eql({
        field: 'testing'
      });
    });
    it('should remove inactive pages', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                depends: {
                  page2: {
                    data: {
                      field: 'something'
                    }
                  }
                }
              },
            }
          },
          chapter2: {
            pages: {
              page2: {}
            }
          }
        }
      };
      const formData = {
        page1: {
          data: {
            otherField: 'testing2'
          }
        },
        page2: {
          data: {
            field: 'testing'
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        field: 'testing'
      });
    });
    it('should remove empty addresses', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {}
            }
          }
        }
      };
      const formData = {
        page1: {
          data: {
            address: {
              country: 'testing'
            }
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.address).to.be.undefined;
    });
  });
});
