import sinon from 'sinon';

import {
  updateRequiredFields,
  setHiddenFields,
  removeHiddenData,
  updateSchemaFromUiSchema,
  updateUiSchema,
  updateItemsSchema,
  replaceRefSchemas,
} from '../../../src/js/state/helpers';

describe('Schemaform formState:', () => {
  describe('updateRequiredFields', () => {
    test('should add field to required array', () => {
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
      expect(updateRequiredFields(schema, uiSchema).required[0]).toBe('test');
    });
    test('should remove field from required array', () => {
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
      expect(updateRequiredFields(schema, uiSchema).required).toHaveLength(0);
    });
    test('should not change schema if required does not change', () => {
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
      expect(updateRequiredFields(schema, uiSchema)).toBe(schema);
    });
    test('should set required in arrays', () => {
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
      ).toBe('test');
    });
  });
  describe('setHiddenFields', () => {
    test('should set field as hidden', () => {
      const schema = {};
      const uiSchema = {
        'ui:options': {
          hideIf: () => true,
        },
      };
      const data = {};

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema['ui:hidden']).toBe(true);
      expect(newSchema).not.toBe(schema);
    });
    test('should not touch non-hidden field without prop', () => {
      const schema = {};
      const uiSchema = {
        'ui:options': {
          hideIf: () => false,
        },
      };
      const data = {};

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema['ui:hidden']).toBeUndefined();
      expect(newSchema).toBe(schema);
    });
    test('should remove hidden prop from schema', () => {
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

      expect(newSchema['ui:hidden']).toBeUndefined();
      expect(newSchema).not.toBe(schema);
    });
    test('should set hidden on object field', () => {
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

      expect(newSchema.properties.field['ui:hidden']).toBe(true);
      expect(newSchema).not.toBe(schema);
    });
    test('should set hidden on nested hidden object field', () => {
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

      expect(newSchema.properties.nestedObject['ui:hidden']).toBe(true);
      expect(newSchema).not.toBe(schema);
    });
    test('should set collapsed on expandUnder field', () => {
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

      expect(newSchema.properties.field['ui:collapsed']).toBe(true);
      expect(newSchema).not.toBe(schema);
    });
    test('should set collapsed on expandUnder field with value condition', () => {
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

      expect(newSchema.properties.field['ui:collapsed']).toBe(true);
      expect(newSchema).not.toBe(schema);
    });
    test('should set collapsed on expandUnder field with function condition', () => {
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

      expect(newSchema.properties.field['ui:collapsed']).toBe(true);
      expect(newSchema).not.toBe(schema);
    });
    test('should set collapsed on nested expandUnder field', () => {
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

      expect(newSchema.properties.nested.properties.field['ui:collapsed']).toBe(
        true,
      );
      expect(newSchema).not.toBe(schema);
    });
    test('should set hidden on array field', () => {
      const schema = {
        type: 'array',
        items: [
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
              hideIf: () => true,
            },
          },
        },
      };
      const data = [{}];

      const newSchema = setHiddenFields(schema, uiSchema, data);

      expect(newSchema).not.toBe(schema);
      expect(newSchema.items[0].properties.field['ui:hidden']).toBe(true);
    });
  });
  describe('removeHiddenData', () => {
    test('should remove hidden field', () => {
      const schema = {
        'ui:hidden': true,
      };
      const data = 'test';

      const newData = removeHiddenData(schema, data);

      expect(newData).toBeUndefined();
    });
    test('should remove hidden field in object', () => {
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

      expect(newData).toEqual({ field: 'test' });
    });
    test('should remove collapsed field in object', () => {
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

      expect(newData).toEqual({ field: 'test' });
    });
    test('should remove collapsed field in nested object', () => {
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

      expect(newData).toEqual({ field: 'test', nested: {} });
    });
    test('should remove hidden field in array', () => {
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

      expect(newData[0]).toEqual({ field: 'test' });
    });
  });
  describe('updateUiSchema', () => {
    describe('if no updateUiSchema are set', () => {
      test('should return the input uiSchema', () => {
        const data = {
          first: 'Pat',
        };
        const uiSchema = {
          first: {
            'ui:title': 'First Name',
          },
        };
        const newUiSchema = updateUiSchema(uiSchema, data);
        expect(newUiSchema).toEqual(uiSchema);
      });
    });
    describe('if a ui:options.updateUiSchema is set', () => {
      const updateUiSchemaStub = sinon
        .stub()
        .callsFake(() => ({ 'ui:title': 'FIRST NAME' }));
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
        newUiSchema = updateUiSchema(uiSchema, data);
      });
      test('should call the updateUiSchema function', () => {
        expect(updateUiSchemaStub.called).toBe(true);
      });
      test('should return the updated uiSchema', () => {
        expect(newUiSchema.first['ui:title']).toBe('FIRST NAME');
        expect(newUiSchema.first['ui:options']).toEqual({
          updateUiSchema: updateUiSchemaStub,
        });
      });
    });
  });

  describe('updateSchemaFromUiSchema', () => {
    test('should update schema', () => {
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
        formData,
      );

      expect(newSchema).toEqual({ type: 'number' });
      expect(newSchema).not.toBe(schema);
    });
    test('should completely replace schema', () => {
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

      expect(newSchema).toEqual({ type: 'string' });
      expect(Object.keys(newSchema)).toEqual(['type']);
      expect(newSchema).not.toBe(schema);
    });
    test('should update schema in object', () => {
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
        formData,
      );

      expect(newSchema.properties.field).toEqual({ type: 'number' });
      expect(newSchema).not.toBe(schema);
    });
    test('should update schema in array', () => {
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
        formData,
      );

      expect(newSchema.items[0].properties.field).toEqual({ type: 'number' });
      expect(newSchema).not.toBe(schema);
    });
  });
  describe('replaceRefSchemas', () => {
    const definitions = {
      common: {
        type: 'string',
      },
    };
    test('should replace ref', () => {
      const schema = {
        $ref: '#/definitions/common',
      };

      const newSchema = replaceRefSchemas(schema, definitions);

      expect(newSchema).toEqual({ type: 'string' });
      expect(newSchema).not.toBe(schema);
    });

    test('should replace nested $ref', () => {
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

      expect(newSchema).toEqual({ type: 'number' });
      expect(newSchema).not.toBe(schema);
    });
    test('should replace ref in object', () => {
      const schema = {
        type: 'object',
        properties: {
          field: {
            $ref: '#/definitions/common',
          },
        },
      };

      const newSchema = replaceRefSchemas(schema, definitions);

      expect(newSchema.properties.field).toEqual({ type: 'string' });
      expect(newSchema).not.toBe(schema);
    });
    test('should update schema in array', () => {
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

      expect(newSchema.items.properties.field).toEqual({ type: 'string' });
      expect(newSchema).not.toBe(schema);
    });
    test('should throw error on missing schema', () => {
      const schema = {
        $ref: '#/definitions/common2',
      };

      const replaceCall = () => replaceRefSchemas(schema, definitions);

      expect(replaceCall).toThrowError(Error);
    });
  });
  describe('updateItemsSchema', () => {
    test('should set array and additional items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'string',
        },
      };

      const newSchema = updateItemsSchema(schema);

      expect(newSchema.additionalItems).toBe(schema.items);
      expect(newSchema.items).toEqual([]);
    });
    test('should remove all item schemas when data is falsy', () => {
      const schema = {
        type: 'array',
        items: [
          {
            type: 'string',
          },
        ],
      };

      const newSchema = updateItemsSchema(schema);

      expect(newSchema.items).toEqual([]);
    });
    test('should remove all item schemas when data is empty', () => {
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

      expect(newSchema.items).toEqual([]);
    });
    test('should add item to array when form data has more items', () => {
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

      expect(newSchema.items.length).toBe(data.length);
      expect(newSchema.items[1]).toBe(schema.additionalItems);
      expect(newSchema.items[2]).toBe(schema.additionalItems);
    });
    test('should remove item from schema items if fewer items in data array', () => {
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

      expect(newSchema.items.length).toBe(data.length);
    });
  });
});
