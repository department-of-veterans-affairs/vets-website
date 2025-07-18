import { expect } from 'chai';
import sinon from 'sinon';

import {
  updateRequiredFields,
  getPreserveHiddenData,
  setHiddenFields,
  removeHiddenData,
  updateSchemaFromUiSchema,
  updateUiSchema,
  updateItemsSchema,
  replaceRefSchemas,
} from '../../../src/js/state/helpers';

describe('Schemaform formState:', () => {
  describe('updateRequiredFields', () => {
    it('should add field to required array', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        test: {
          'ui:required': () => true,
        },
      };
      expect(updateRequiredFields(schema, uiSchema).required[0]).to.equal(
        'test',
      );
    });
    it('should remove field from required array', () => {
      const schema = {
        type: 'object',
        required: ['test'],
        properties: {
          test: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        test: {
          'ui:required': () => false,
        },
      };
      expect(updateRequiredFields(schema, uiSchema).required).to.be.empty;
    });
    it('should not change schema if required does not change', () => {
      const schema = {
        type: 'object',
        required: ['test'],
        properties: {
          test: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        test: {
          'ui:required': () => true,
        },
      };
      expect(updateRequiredFields(schema, uiSchema)).to.equal(schema);
    });
    it('should set required in arrays', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              test: {
                type: 'string',
              },
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            test: {
              type: 'string',
            },
          },
        },
      };
      const uiSchema = {
        items: {
          test: {
            'ui:required': () => true,
          },
        },
      };
      const data = [{}];
      expect(
        updateRequiredFields(schema, uiSchema, data).items[0].required[0],
      ).to.equal('test');
    });
    it('should pass full data & index in arrays', () => {
      const requiredSpy = sinon.stub().returns(true);
      const schema = {
        type: 'array',
        items: [
          { type: 'object', properties: { test: { type: 'string' } } },
          { type: 'object', properties: { test: { type: 'string' } } },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            test: {
              type: 'string',
            },
          },
        },
      };
      const uiSchema = {
        items: {
          test: {
            'ui:required': requiredSpy,
          },
        },
      };
      const data = [{ test2: true }];
      const fullData = { test: data, test3: false };
      updateRequiredFields(schema, uiSchema, data, null, fullData);
      expect(requiredSpy.args[0]).to.deep.equal([
        data,
        0,
        fullData,
        [0, 'test'],
      ]);
      expect(requiredSpy.args[1]).to.deep.equal([
        data,
        1,
        fullData,
        [1, 'test'],
      ]);
    });
  });

  describe('getPreserveHiddenData', () => {
    const preserveTrue = { 'ui:options': { preserveHiddenData: true } };
    const preserveFalse = { 'ui:options': { preserveHiddenData: false } };

    it('should return preserveHiddenData from top level uiSchema', () => {
      expect(getPreserveHiddenData(preserveTrue)).to.be.true;
      expect(getPreserveHiddenData()).to.be.false;
      expect(getPreserveHiddenData({})).to.be.false;
      expect(getPreserveHiddenData(preserveFalse)).to.be.false;
    });
    it('should return preserveHiddenData from one level deep in uiSchema', () => {
      expect(getPreserveHiddenData({ test: preserveTrue })).to.be.true;
      expect(getPreserveHiddenData({ test: preserveFalse })).to.be.false;
    });

    it('should return preserveHiddenData from two levels deep in uiSchema', () => {
      expect(
        getPreserveHiddenData({
          test: { test1: preserveFalse, test2: preserveFalse },
        }),
      ).to.be.false;
      expect(
        getPreserveHiddenData({
          test: { test1: preserveFalse, test2: preserveTrue },
        }),
      ).to.be.true;
    });

    it('should return preserveHiddenData true if set anywhere on the page', () => {
      expect(
        getPreserveHiddenData({
          test: {
            test1: preserveFalse,
            test2: preserveFalse,
            test3: preserveTrue,
          },
        }),
      ).to.be.true;
    });
  });

  describe('setHiddenFields', () => {
    it('should set field as hidden', () => {
      const schema = {};
      const uiSchema = {
        'ui:options': {
          hideIf: () => true,
        },
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
          hideIf: () => false,
        },
      };
      const data = {};

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema['ui:hidden']).to.be.undefined;
      expect(newSchema).to.equal(schema);
    });
    it('should remove hidden prop from schema', () => {
      const schema = {
        'ui:hidden': true,
      };
      const uiSchema = {
        'ui:options': {
          hideIf: () => false,
        },
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
          field: {},
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            hideIf: () => true,
          },
        },
      };
      const data = { field: '' };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.field['ui:hidden']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set hidden on nested hidden object field', () => {
      const schema = {
        type: 'object',
        properties: {
          unhide: { type: 'boolean' },
          nestedObject: {},
        },
      };
      const uiSchema = {
        'ui:options': { hideIf: () => false },
        nestedObject: {
          'ui:options': { hideIf: () => true },
        },
      };
      const data = { unhide: false };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.nestedObject['ui:hidden']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set collapsed on expandUnder field', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {},
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            expandUnder: 'field2',
          },
        },
      };
      const data = { field: '', field2: false };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.field['ui:collapsed']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set collapsed on expandUnder field with value condition', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {},
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            expandUnder: 'field2',
            expandUnderCondition: 'blah',
          },
        },
      };
      const data = { field: '', field2: 'bleh' };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.field['ui:collapsed']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set collapsed on expandUnder field with function condition', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {},
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            expandUnder: 'field2',
            expandUnderCondition: () => false,
          },
        },
      };
      const data = { field: '', field2: 'bleh' };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.field['ui:collapsed']).to.be.true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should not set collapsed on expandUnder field with function condition based on formData', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {},
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            expandUnder: 'field2',
            expandUnderCondition: (condition, formData) =>
              formData.field2 === 'bleh',
          },
        },
      };
      const data = { field: '', field2: 'bleh' };
      // condition is met so we expect this field to not be collapsed
      const newSchema = setHiddenFields(schema, uiSchema, data);
      expect(newSchema.properties.field['ui:collapsed']).to.be.false;
    });
    it('should set collapsed on expandUnder field with function condition based on formData', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {},
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            expandUnder: 'field2',
            expandUnderCondition: (condition, formData) =>
              formData.field2 === 'foo',
          },
        },
      };
      const data = { field: '', field2: 'bleh' };
      // condition is not met so we expect this field to be collapsed
      const newSchema = setHiddenFields(schema, uiSchema, data);
      expect(newSchema.properties.field['ui:collapsed']).to.be.true;
    });
    it('should not set collapsed on expandUnder array field', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              field: {},
              field2: {},
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            field: {},
          },
        },
      };
      const uiSchema = {
        items: {
          field: {
            'ui:options': {
              expandUnder: 'field2',
              expandUnderCondition: (condition, formData) =>
                formData.field2 === 'bleh',
            },
          },
        },
      };
      const data = { field: '', field2: 'bleh' };
      const path = ['path'];
      const fullData = { arrayFields: data, otherField: 'bleh' };
      // condition is met so we expect this field to not be collapsed
      const newSchema = setHiddenFields(schema, uiSchema, data, path, fullData);
      expect(newSchema).not.to.equal(schema);
      expect(newSchema.items[0].properties.field['ui:collapsed']).to.be.false;
      expect(newSchema.items[0].properties.field2['ui:collapsed']).to.be
        .undefined;
    });
    it('should set collapsed on expandUnder array field', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              field: {},
              field2: {},
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            field: {},
          },
        },
      };
      const uiSchema = {
        items: {
          field: {
            'ui:options': {
              expandUnder: 'field2',
              expandUnderCondition: (condition, formData) =>
                formData.field2 === 'foo',
            },
          },
        },
      };
      const data = { field: '', field2: 'bleh' };
      const path = ['path'];
      const fullData = { arrayFields: data, otherField: 'foo' };
      // condition is not met so we expect this field to be collapsed
      const newSchema = setHiddenFields(schema, uiSchema, data, path, fullData);
      expect(newSchema).not.to.equal(schema);
      expect(newSchema.items[0].properties.field['ui:collapsed']).to.be.true;
      expect(newSchema.items[0].properties.field2['ui:collapsed']).to.be
        .undefined;
    });
    it('should set collapsed on nested expandUnder field', () => {
      const schema = {
        type: 'object',
        properties: {
          nested: {
            type: 'object',
            properties: {
              field: {},
              field2: {},
            },
          },
        },
      };
      const uiSchema = {
        nested: {
          field: {
            'ui:options': {
              expandUnder: 'field2',
            },
          },
        },
      };
      const data = { nested: { field: '', field2: false } };

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema.properties.nested.properties.field['ui:collapsed']).to.be
        .true;
      expect(newSchema).not.to.equal(schema);
    });
    it('should set hidden on array field', () => {
      const hideIfSpy = sinon.stub().returns(true);
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              field: {},
            },
          },
          {
            type: 'object',
            properties: {
              field: {},
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            field: {},
          },
        },
      };
      const uiSchema = {
        items: {
          field: {
            'ui:options': {
              hideIf: hideIfSpy,
            },
          },
        },
      };
      const data = [{ test2: true }];
      const path = ['test'];
      const fullData = { test: data, test3: false };

      const newSchema = setHiddenFields(schema, uiSchema, data, path, fullData);

      expect(newSchema).not.to.equal(schema);
      expect(newSchema.items[0].properties.field['ui:hidden']).to.be.true;
      expect(hideIfSpy.args[0]).to.deep.equal([
        data,
        0,
        fullData,
        ['test', 0, 'field'],
      ]);
      expect(hideIfSpy.args[1]).to.deep.equal([
        data,
        1,
        fullData,
        ['test', 1, 'field'],
      ]);
    });
  });
  describe('removeHiddenData', () => {
    it('should not throw JS error', () => {
      const newData = removeHiddenData();
      expect(newData).to.be.undefined;
    });
    it('should remove hidden field', () => {
      const schema = {
        'ui:hidden': true,
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
            'ui:hidden': true,
          },
        },
      };
      const data = { field: 'test', field2: 'test2' };

      const newData = removeHiddenData(schema, data);

      expect(newData).to.eql({ field: 'test' });
    });
    it('should remove collapsed field in object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          field2: {
            'ui:collapsed': true,
          },
        },
      };
      const data = { field: 'test', field2: 'test2' };

      const newData = removeHiddenData(schema, data);

      expect(newData).to.eql({ field: 'test' });
    });
    it('should remove collapsed field in nested object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {},
          nested: {
            type: 'object',
            properties: {
              field2: {
                'ui:collapsed': true,
              },
            },
          },
        },
      };
      const data = { field: 'test', nested: { field2: 'test2' } };

      const newData = removeHiddenData(schema, data);

      expect(newData).to.eql({ field: 'test', nested: {} });
    });
    it('should remove hidden field in array', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              field: {},
              field2: {
                'ui:hidden': true,
              },
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            field: {},
            field2: {},
          },
        },
      };
      const data = [{ field: 'test', field2: 'test2' }];

      const newData = removeHiddenData(schema, data);

      expect(newData[0]).to.eql({ field: 'test' });
    });
  });

  describe('updateUiSchema', () => {
    describe('if no updateUiSchema are set', () => {
      it('should return the input uiSchema', () => {
        const schema = {
          type: 'object',
          properties: {
            first: {
              type: 'string',
            },
          },
        };
        const data = {
          first: 'Pat',
        };
        const uiSchema = {
          first: {
            'ui:title': 'First Name',
          },
        };
        const newUiSchema = updateUiSchema(schema, uiSchema, data);
        expect(newUiSchema).to.equal(uiSchema); // same object
      });
    });

    describe('if using updateUiSchema for a object of fields', () => {
      it('should be able to be used for multiple fields with deep replace', () => {
        const schema = {
          type: 'object',
          properties: {
            fullName: {
              type: 'object',
              properties: {
                first: {
                  type: 'string',
                },
                last: {
                  type: 'string',
                },
              },
            },
          },
        };
        const formData = {
          fullName: {
            first: 'Pat',
            last: 'Smith',
          },
        };
        const updateUiSchemaFn = () => {
          return {
            first: {
              'ui:title': `Updated First Name`,
              'ui:options': {
                charcount: 20,
              },
            },
          };
        };
        const uiSchema = {
          fullName: {
            first: {
              'ui:title': 'First Name',
              'ui:options': {
                hint: 'This is a hint',
                charcount: 30,
              },
            },
            last: {
              'ui:title': 'Last Name',
            },
            'ui:options': {
              updateUiSchema: updateUiSchemaFn,
            },
          },
        };
        const expectedUpdatedUiSchema = {
          fullName: {
            first: {
              'ui:title': `Updated First Name`,
              'ui:options': {
                hint: 'This is a hint',
                charcount: 20,
              },
            },
            last: {
              'ui:title': 'Last Name',
            },
            'ui:options': {
              updateUiSchema: updateUiSchemaFn,
            },
          },
        };
        const newUiSchema = updateUiSchema(schema, uiSchema, formData);
        expect(newUiSchema).to.deep.equal(expectedUpdatedUiSchema); // new object

        const expectedUiSchema = newUiSchema;
        const sameUiSchema = updateUiSchema(schema, newUiSchema, formData);
        expect(sameUiSchema).to.equal(expectedUiSchema); // same object
      });
      it('should pass in fullData into updateUiSchema ui option function', () => {
        const schema = {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
          },
        };
        const data = { fullName: 'Pat Smith' };
        const fullData = { fullName: 'Pat Smith', otherField: 'other' };
        const index = 2;
        const updateUiSchemaSpy = sinon.spy();
        const uiSchema = {
          fullName: {
            'ui:title': 'Full Name',
            'ui:options': {
              updateUiSchema: updateUiSchemaSpy,
            },
          },
        };
        updateUiSchema(schema, uiSchema, data, fullData, index);
        expect(updateUiSchemaSpy.args[0]).to.deep.equal([
          data,
          fullData,
          index,
        ]);
      });
    });

    describe('if using updateUiSchema for an individual field', () => {
      it('should be able to replace given properties', () => {
        const schema = {
          type: 'object',
          properties: {
            fullName: {
              type: 'object',
              properties: {
                first: {
                  type: 'string',
                },
                last: {
                  type: 'string',
                },
              },
            },
          },
        };
        const formData = {
          fullName: {
            first: 'Pat',
            last: 'Smith',
          },
        };
        const updateUiSchemaFn = () => {
          return {
            'ui:title': `Updated First Name`,
            'ui:options': {
              charcount: 20,
            },
          };
        };
        const uiSchema = {
          fullName: {
            first: {
              'ui:title': 'First Name',
              'ui:options': {
                hint: 'This is a hint',
                charcount: 30,
                updateUiSchema: updateUiSchemaFn,
              },
            },
            last: {
              'ui:title': 'Last Name',
            },
          },
        };
        const expectedUpdatedUiSchema = {
          fullName: {
            first: {
              'ui:title': `Updated First Name`,
              'ui:options': {
                hint: 'This is a hint',
                charcount: 20,
                updateUiSchema: updateUiSchemaFn,
              },
            },
            last: {
              'ui:title': 'Last Name',
            },
          },
        };
        const newUiSchema = updateUiSchema(schema, uiSchema, formData);
        expect(newUiSchema).to.deep.equal(expectedUpdatedUiSchema); // new object

        const expectedUiSchema = newUiSchema;
        const sameUiSchema = updateUiSchema(schema, newUiSchema, formData);
        expect(sameUiSchema).to.equal(expectedUiSchema); // same object
      });
    });

    describe('if a ui:options.updateUiSchema is set', () => {
      const updateUiSchemaStub = sinon
        .stub()
        .callsFake(() => ({ 'ui:title': 'FIRST NAME' }));
      const schema = {
        type: 'object',
        properties: {
          first: {
            type: 'string',
          },
        },
      };
      const data = {
        first: 'Pat',
      };
      const uiSchema = {
        first: {
          'ui:title': 'First Name',
          'ui:options': {
            updateUiSchema: updateUiSchemaStub,
          },
        },
      };
      let newUiSchema;
      beforeEach(() => {
        newUiSchema = updateUiSchema(schema, uiSchema, data);
      });
      it('should call the updateUiSchema function', () => {
        expect(updateUiSchemaStub.called).to.be.true;
      });
      it('should return the updated uiSchema', () => {
        expect(newUiSchema.first['ui:title']).to.equal('FIRST NAME');
        expect(newUiSchema.first['ui:options']).to.deep.equal({
          updateUiSchema: updateUiSchemaStub,
        });
      });
    });
  });

  describe('updateSchemaFromUiSchema', () => {
    it('should update schema', () => {
      const schema = {
        type: 'string',
      };
      const uiSchema = {
        'ui:options': {
          updateSchema: () => ({ type: 'number' }),
        },
      };
      const data = 'test';
      const formData = {};

      const newSchema = updateSchemaFromUiSchema(
        schema,
        uiSchema,
        data,
        0, // index
        '', // path
        formData,
      );

      expect(newSchema).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should completely replace schema', () => {
      const schema = {
        type: 'string',
        enum: ['a', 'b'],
      };
      const uiSchema = {
        'ui:options': {
          replaceSchema: () => ({ type: 'string' }),
        },
      };

      const newSchema = updateSchemaFromUiSchema(schema, uiSchema);

      expect(newSchema).to.eql({ type: 'string' });
      expect(Object.keys(newSchema)).to.eql(['type']);
      expect(newSchema).not.to.equal(schema);
    });
    it('should update schema in object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            updateSchema: () => ({ type: 'number' }),
          },
        },
      };
      const data = {};
      const formData = {};

      const newSchema = updateSchemaFromUiSchema(
        schema,
        uiSchema,
        data,
        0, // index
        '', // path
        formData,
      );

      expect(newSchema.properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should update schema in array', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
            },
          },
        ],
        additionalItems: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      };
      const uiSchema = {
        items: {
          field: {
            'ui:options': {
              updateSchema: () => ({ type: 'number' }),
            },
          },
        },
      };
      const data = [{}];
      const formData = {};

      const newSchema = updateSchemaFromUiSchema(
        schema,
        uiSchema,
        data,
        0, // index
        '', // path
        formData,
      );

      expect(newSchema.items[0].properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should pass in full data into updateSchema ui options callback', () => {
      const updateSchemaStub = sinon.stub();
      updateSchemaStub.returns({ type: 'number' });

      const schema = {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            updateSchema: updateSchemaStub,
          },
        },
      };
      const data = { entry: 1 };
      const formData = { entries: [{ entry: 1 }, { entry: 2 }] };

      const newSchema = updateSchemaFromUiSchema(
        schema,
        uiSchema,
        data,
        0, // index
        '', // path
        formData,
      );

      expect(newSchema.properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
      expect(updateSchemaStub.args[0]).to.deep.equal([
        data,
        schema.properties.field,
        uiSchema.field,
        0,
        'field',
        formData,
      ]);
    });
    it('should pass in full data which falls back to data in updateSchema ui options callback', () => {
      const updateSchemaStub = sinon.stub();
      updateSchemaStub.returns({ type: 'number' });

      const schema = {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            updateSchema: updateSchemaStub,
          },
        },
      };
      const data = { entries: [{ entry: 1 }, { entry: 2 }] };
      const formData = null;

      const newSchema = updateSchemaFromUiSchema(
        schema,
        uiSchema,
        data,
        0, // index
        '', // path
        formData,
      );

      expect(newSchema.properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
      expect(updateSchemaStub.args[0]).to.deep.equal([
        data,
        schema.properties.field,
        uiSchema.field,
        0,
        'field',
        data,
      ]);
    });
    it('should pass in full data which falls back to data in replaceSchema ui options callback', () => {
      const replaceSchemaStub = sinon.stub();
      replaceSchemaStub.returns({ type: 'number' });

      const schema = {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      };
      const uiSchema = {
        field: {
          'ui:options': {
            replaceSchema: replaceSchemaStub,
          },
        },
      };
      const data = { entries: [{ entry: 1 }, { entry: 2 }] };
      const formData = null;

      const newSchema = updateSchemaFromUiSchema(
        schema,
        uiSchema,
        data,
        0, // index
        '', // path
        formData,
      );

      expect(newSchema.properties.field).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
      expect(replaceSchemaStub.args[0]).to.deep.equal([
        data,
        schema.properties.field,
        uiSchema.field,
        0,
        'field',
        data,
      ]);
    });
  });
  describe('replaceRefSchemas', () => {
    const definitions = {
      common: {
        type: 'string',
      },
    };
    it('should replace ref', () => {
      const schema = {
        $ref: '#/definitions/common',
      };

      const newSchema = replaceRefSchemas(schema, definitions);

      expect(newSchema).to.eql({ type: 'string' });
      expect(newSchema).not.to.equal(schema);
    });

    it('should replace nested $ref', () => {
      const schema = {
        $ref: '#/definitions/common',
      };
      const nestedDefinitions = {
        common: {
          $ref: '#/definitions/nested',
        },
        nested: {
          type: 'number',
        },
      };

      const newSchema = replaceRefSchemas(schema, nestedDefinitions);

      expect(newSchema).to.eql({ type: 'number' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should replace ref in object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {
            $ref: '#/definitions/common',
          },
        },
      };

      const newSchema = replaceRefSchemas(schema, definitions);

      expect(newSchema.properties.field).to.eql({ type: 'string' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should update schema in array', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              $ref: '#/definitions/common',
            },
          },
        },
      };

      const newSchema = replaceRefSchemas(schema, definitions);

      expect(newSchema.items.properties.field).to.eql({ type: 'string' });
      expect(newSchema).not.to.equal(schema);
    });
    it('should throw error on missing schema', () => {
      const schema = {
        $ref: '#/definitions/common2',
      };

      const replaceCall = () => replaceRefSchemas(schema, definitions);

      expect(replaceCall).to.throw(
        Error,
        /Missing definition for #\/definitions\/common2/,
      );
    });
  });
  describe('updateItemsSchema', () => {
    it('should set array and additional items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'string',
        },
      };

      const newSchema = updateItemsSchema(schema);

      expect(newSchema.additionalItems).to.equal(schema.items);
      expect(newSchema.items).to.eql([]);
    });
    it('should remove all item schemas when data is falsy', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'string',
          },
        ],
      };

      const newSchema = updateItemsSchema(schema);

      expect(newSchema.items).to.eql([]);
    });
    it('should remove all item schemas when data is empty', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'string',
          },
        ],
      };
      const data = [];

      const newSchema = updateItemsSchema(schema, data);

      expect(newSchema.items).to.eql([]);
    });
    it('should add item to array when form data has more items', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'string',
          },
        ],
        additionalItems: {
          type: 'string',
        },
      };
      const data = ['test', 'test2', 'test3'];

      const newSchema = updateItemsSchema(schema, data);

      expect(newSchema.items.length).to.equal(data.length);
      expect(newSchema.items[1]).to.equal(schema.additionalItems);
      expect(newSchema.items[2]).to.equal(schema.additionalItems);
    });
    it('should remove item from schema items if fewer items in data array', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
        additionalItems: {
          type: 'string',
        },
      };
      const data = ['test'];

      const newSchema = updateItemsSchema(schema, data);

      expect(newSchema.items.length).to.equal(data.length);
    });
  });
});
