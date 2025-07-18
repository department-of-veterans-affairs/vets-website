import { expect } from 'chai';
import {
  parseISODate,
  formatISOPartialDate,
  hasFieldsOtherThanArray,
  transformForSubmit,
  getArrayFields,
  setArrayRecordTouched,
  getNonArraySchema,
  checkValidSchema,
  formatReviewDate,
  expandArrayPages,
  omitRequired,
  showReviewField,
  stringifyUrlParams,
  getUrlPathIndex,
  convertUrlPathToPageConfigPath,
} from '../../src/js/helpers';

describe('Schemaform helpers:', () => {
  describe('parseISODate', () => {
    it('should parse an ISO date', () => {
      expect(parseISODate('2001-02-03')).to.eql({
        month: '2',
        day: '3',
        year: '2001',
      });
    });
    it('should parse a partial ISO date', () => {
      expect(parseISODate('XXXX-02-03')).to.eql({
        month: '2',
        day: '3',
        year: '',
      });
      expect(parseISODate('2003-XX-03')).to.eql({
        month: '',
        day: '3',
        year: '2003',
      });
      expect(parseISODate('2003-02-XX')).to.eql({
        month: '2',
        day: null,
        year: '2003',
      });
      expect(parseISODate('2003-02')).to.eql({
        month: '2',
        day: null,
        year: '2003',
      });
      expect(parseISODate('2003')).to.eql({
        month: '',
        day: null,
        year: '2003',
      });
    });
  });
  describe('formatISOPartialDate', () => {
    it('should format a regular date', () => {
      const date = {
        month: '3',
        day: '29',
        year: '2005',
      };
      expect(formatISOPartialDate(date)).to.equal('2005-03-29');
    });
    it('should format a partial date', () => {
      const date = {
        month: '2',
        day: '',
        year: '2005',
      };
      expect(formatISOPartialDate(date)).to.equal('2005-02-XX');
    });
    it('should format an empty date as undefined', () => {
      const date = {
        month: '',
        day: '',
        year: '',
      };
      expect(formatISOPartialDate(date)).to.be.undefined;
    });
  });
  describe('hasFieldsOtherThanArray', () => {
    it('should return true if non-array fields', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'array',
          },
          test2: {
            type: 'string',
          },
        },
      };

      expect(hasFieldsOtherThanArray(schema)).to.be.true;
    });
    it('should return true if nested non-array fields', () => {
      const schema = {
        type: 'object',
        properties: {
          test: {
            type: 'array',
          },
          test2: {
            type: 'object',
            properties: {
              test3: {
                type: 'number',
              },
            },
          },
        },
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
                  type: 'string',
                },
              },
            },
          },
        },
      };

      expect(hasFieldsOtherThanArray(schema)).to.be.false;
    });
  });
  describe('getArrayFields', () => {
    it('should get array', () => {
      const data = {
        schema: {
          type: 'array',
        },
        uiSchema: {},
      };

      const fields = getArrayFields(data);

      expect(fields).not.to.be.empty;
    });
    it('should skip array using option', () => {
      const data = {
        schema: {
          type: 'array',
        },
        uiSchema: {
          'ui:options': {
            keepInPageOnReview: true,
          },
        },
      };

      const fields = getArrayFields(data);

      expect(fields).to.be.empty;
    });
    it('should get array in object', () => {
      const data = {
        schema: {
          type: 'object',
          properties: {
            field: {
              type: 'array',
            },
          },
        },
        uiSchema: {},
      };

      const fields = getArrayFields(data, {});

      expect(fields).not.to.be.empty;
      expect(fields[0].path).to.eql(['field']);
    });
    it('should not get hidden array', () => {
      const data = {
        schema: {
          type: 'array',
          'ui:hidden': true,
        },
        uiSchema: {},
      };

      const fields = getArrayFields(data, {});

      expect(fields).to.be.empty;
    });
    it('should not get array in hidden object', () => {
      const data = {
        schema: {
          type: 'object',
          'ui:collapsed': true,
          properties: {
            field: {
              type: 'array',
            },
          },
        },
        uiSchema: {},
      };

      const fields = getArrayFields(data, {});

      expect(fields).to.be.empty;
    });
    it('should not throw an error', () => {
      const data = {
        schema: {
          type: 'object',
          properties: {
            veteran: {
              type: 'object',
              required: ['address'],
              properties: {
                address: {
                  type: 'object',
                  required: [],
                  properties: {},
                },
              },
            },
          },
        },
        uiSchema: {},
      };
      // TypeError: Cannot read property 'address' of undefined is thrown
      // without optional chaining
      const fields = getArrayFields(data);

      expect(fields).to.be.empty;
    });
  });
  describe('transformForSubmit', () => {
    it('should flatten page data within chapter', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
              page2: {},
            },
          },
        },
      };
      const formData = {
        data: {
          otherField: 'testing2',
          field: 'testing',
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        otherField: 'testing2',
        field: 'testing',
      });
    });
    it('should flatten page data across chapters', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
          chapter2: {
            pages: {
              page2: {},
            },
          },
        },
      };
      const formData = {
        data: {
          otherField: 'testing2',
          field: 'testing',
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        otherField: 'testing2',
        field: 'testing',
      });
    });
    it('should remove view fields', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          'view:Test': 'thing',
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output['view:Test']).to.be.undefined;
    });
    it('should flatten view objects', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          'view:Test': {
            field: 'testing',
          },
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output['view:Test']).to.be.undefined;
      expect(output).to.eql({
        field: 'testing',
      });
    });
    it('should flatten view objects and remove null, undefined, or empty fields', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          'view:Test': {
            field: 'testing',
            fieldObject: {
              field: 'testing',
              nullField: null,
              undefinedField: undefined,
            },
            nullField: null,
            undefinedField: undefined,
            nullObject: {
              nullField: null,
            },
            undefinedObject: {
              undefinedField: undefined,
            },
            empty: {},
          },
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));
      expect(output['view:Test']).to.be.undefined;
      expect(output).to.eql({
        field: 'testing',
        fieldObject: {
          field: 'testing',
        },
      });
    });
    it('should remove inactive pages', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                schema: {
                  type: 'object',
                  properties: {
                    otherField: {
                      type: 'string',
                    },
                  },
                },
                depends: {
                  field: 'something',
                },
              },
            },
          },
          chapter2: {
            pages: {
              page2: {
                schema: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      };
      const formData = {
        data: {
          otherField: 'testing2',
          field: 'testing',
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        field: 'testing',
      });
    });
    it('should not remove properties that are on both active and inactive pages', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                schema: {
                  type: 'object',
                  properties: {
                    otherField: {
                      type: 'string',
                    },
                    anotherField: {
                      type: 'string',
                    },
                  },
                },
                depends: {
                  field: 'something',
                },
              },
            },
          },
          chapter2: {
            pages: {
              page2: {
                schema: {
                  type: 'object',
                  properties: {
                    anotherField: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      };
      const formData = {
        data: {
          otherField: 'testing2',
          anotherField: 'testing3',
          field: 'testing',
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.eql({
        field: 'testing',
        anotherField: 'testing3',
      });
    });

    it('should remove empty addresses', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          address: {
            country: 'testing',
          },
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.address).to.be.undefined;
    });

    it('should not remove empty addresses if allowPartialAddress is true', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          address: {
            country: 'testing',
          },
        },
      };

      const output = JSON.parse(
        transformForSubmit(formConfig, formData, {
          allowPartialAddress: true,
        }),
      );

      expect(output.address.country).to.eql('testing');
    });

    it('should remove empty objects, null fields, and undefined fields', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          someField1: {},
          someField2: {
            someData: undefined,
          },
          someField3: {
            someData: null,
          },
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.deep.equal({});
    });

    it('should remove nested empty objects, null fields, and undefined fields', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          someField1: {
            someData: {
              someOtherData: null,
            },
          },
          someField2: {
            someData: {
              someOtherData: undefined,
            },
          },
          someField3: {
            someData: {
              someOtherData: null,
              someValue: 'some value',
            },
          },
          someField4: {
            someData: {
              someOtherData: undefined,
              someValue: 'some value',
            },
          },
          someField5: {
            someData: {
              someOtherData: {
                yetMoreData: null,
                yetMoreValue: 'yet more value',
              },
              someValue: 'some value',
            },
          },
          someField6: {
            someData: {
              someOtherData: {
                yetMoreData: undefined,
                yetMoreValue: 'yet more value',
              },
              someValue: 'some value',
            },
          },
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.deep.equal({
        someField1: {},
        someField2: {},
        someField3: { someData: { someValue: 'some value' } },
        someField4: { someData: { someValue: 'some value' } },
        someField5: {
          someData: {
            someOtherData: { yetMoreValue: 'yet more value' },
            someValue: 'some value',
          },
        },
        someField6: {
          someData: {
            someOtherData: { yetMoreValue: 'yet more value' },
            someValue: 'some value',
          },
        },
      });
    });

    it('should remove empty objects, null fields, and undefined fields within an array', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          someField: {
            subField: [
              { foo: 'bar' },
              {},
              { someField1: null },
              { someField2: undefined },
              {
                someField3: {
                  someData: 'some data',
                  notSomeData: null,
                  alsoNotSomeData: undefined,
                },
              },
            ],
          },
          arrayField: [
            { foo: 'bar' },
            {},
            { someField1: null },
            { someField2: undefined },
          ],
          emptyArray: [{}, {}, { someField1: null }, { someField2: undefined }],
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output).to.deep.equal({
        someField: {
          subField: [{ foo: 'bar' }, { someField3: { someData: 'some data' } }],
        },
        arrayField: [{ foo: 'bar' }],
      });
    });
    it('should convert autosuggest field to id', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {},
            },
          },
        },
      };
      const formData = {
        data: {
          someField2: {
            widget: 'autosuggest',
            id: '1',
            label: 'test',
          },
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.someField2).to.equal('1');
    });
    it('should not remove inactive pagePerItem pages if some of the pages are active', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                showPagePerItem: true,
                arrayPath: 'testArray',
                path: '/test/:index',
                schema: {
                  type: 'object',
                  properties: {
                    testArray: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          isActive: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
                depends: (data, index) => data.testArray[index].isActive,
              },
            },
          },
        },
      };
      const formData = {
        data: {
          testArray: [{ isActive: true }, { isActive: false }],
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.testArray).not.to.be.undefined;
    });
    it('should remove inactive pagePerItem pages if none of the pages are active', () => {
      const formConfig = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                showPagePerItem: true,
                arrayPath: 'testArray',
                path: '/test/:index',
                schema: {
                  type: 'object',
                  properties: {
                    testArray: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          isActive: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
                depends: (data, index) => data.testArray[index].isActive,
              },
            },
          },
        },
      };
      const formData = {
        data: {
          testArray: [{ isActive: false }, { isActive: false }],
        },
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.testArray).to.be.undefined;
    });
  });
  describe('setArrayRecordTouched', () => {
    /* eslint-disable camelcase */
    it('should set field as touched', () => {
      const touched = setArrayRecordTouched('root', 0);

      expect(touched).to.eql({
        root_0: true,
      });
    });
    /* eslint-enable camelcase */
  });
  describe('getNonArraySchema', () => {
    it('should return undefined if array', () => {
      const result = getNonArraySchema({ type: 'array' });

      expect(result.schema).to.be.undefined;
    });
    it('should skip array fields using option', () => {
      const result = getNonArraySchema(
        { type: 'array' },
        { 'ui:option': { keepInPageOnReview: true } },
      );

      expect(result.schema).to.be.undefined;
    });
    it('should return undefined if nested array', () => {
      const result = getNonArraySchema({
        type: 'object',
        properties: {
          field: {
            type: 'array',
          },
        },
      });

      expect(result.schema).to.be.undefined;
    });
    it('should return fields without array', () => {
      const result = getNonArraySchema({
        type: 'object',
        required: ['field', 'field2'],
        properties: {
          field: {
            type: 'string',
          },
          field2: {
            type: 'array',
          },
        },
      });

      expect(result.schema).to.eql({
        type: 'object',
        required: ['field'],
        properties: {
          field: {
            type: 'string',
          },
        },
      });
    });

    it('should return original input fields if ui:options.displayEmptyObjectOnReview is true', () => {
      const result = getNonArraySchema(
        {
          type: 'object',
          required: [],
          properties: {
            field1: {
              type: 'object',
              properties: {},
            },
            field2: {
              type: 'object',
              properties: {},
            },
          },
        },
        {
          field1: {
            'ui:description': 'My field1 text',
            'ui:options': {
              displayEmptyObjectOnReview: true,
            },
          },
          field2: {
            'ui:description': 'My field2 text',
            'ui:options': {
              displayEmptyObjectOnReview: true,
            },
          },
        },
      );

      expect(result.schema).to.eql({
        type: 'object',
        required: [],
        properties: {
          field1: {
            type: 'object',
            properties: {},
          },
          field2: {
            type: 'object',
            properties: {},
          },
        },
      });

      expect(result.uiSchema).to.eql({
        field1: {
          'ui:description': 'My field1 text',
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        field2: {
          'ui:description': 'My field2 text',
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
      });
    });

    it('should return fields without array', () => {
      const result = getNonArraySchema(
        {
          type: 'object',
          required: ['field1', 'field2'],
          properties: {
            field1: {
              type: 'string',
              properties: {},
            },
            field2: {
              type: 'object',
              properties: {},
            },
          },
        },
        {
          'ui:order': ['field1', 'field2'],
          field1: {
            'ui:description': 'My field1 text',
          },
          field2: {
            'ui:description': 'My field2 text',
          },
        },
      );

      expect(result.uiSchema).to.eql({
        'ui:order': ['field1'],
        field1: {
          'ui:description': 'My field1 text',
        },
        field2: {
          'ui:description': 'My field2 text',
        },
      });
    });
  });

  describe('checkValidSchema', () => {
    it('should return true for valid schema', () => {
      const s = {
        type: 'object',
        properties: {
          // Only type
          field1: {
            type: 'string',
          },
          // Object with blank properties
          field2: {
            type: 'object',
            properties: {},
          },
          // Nested object properties
          field3: {
            type: 'object',
            properties: {
              nestedField: { type: 'string' }, // Missing type
            },
          },
          // Array with items object
          field4: {
            type: 'array',
            items: { type: 'string' },
          },
          // Array with items array
          field5: {
            type: 'array',
            additionalItems: { type: 'string' },
            items: [{ type: 'string' }],
          },
        },
      };

      // If this throws an error, the test will fail
      expect(checkValidSchema(s)).to.equal(true);
    });
    it('should throw an error for invalid schemas', () => {
      const s = {
        type: 'object',
        properties: {
          // Missing type
          field1: {
            // type: 'object'
          },
          // Missing properties inside
          field2: {
            type: 'object',
            // properties: {}
          },
          // Invalid nested property
          field3: {
            type: 'object',
            properties: {
              nestedField: {}, // Missing type
            },
          },
          // Missing items
          field4: {
            type: 'array',
            // items: {}
          },
          // Invalid additionalItems
          field5: {
            type: 'array',
            items: [
              {
                type: 'object',
                properties: {
                  nestedField: { type: 'string' },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              // properties: {} // Missing properties
            },
          },
          // Invalid items array
          field6: {
            type: 'array',
            additionalItems: { type: 'string' },
            items: [
              {
                /* type: 'string' */
              },
            ],
          },
          // Invalid items object
          field7: {
            type: 'array',
            items: {
              /* type: 'string' */
            },
          },
          // Missing additionalItems when items is an array
          field8: {
            type: 'array',
            // additionalItems: { type: 'string' },
            items: [{ type: 'string' }],
          },
          // Shouldn't have additionalItems when items is an object
          field9: {
            type: 'array',
            additionalItems: { type: 'string' },
            items: { type: 'string' },
          },
        },
      };

      let isValid;
      try {
        isValid = checkValidSchema(s);
      } catch (err) {
        // Perhaps this should not be in this test...Seems pretty brittle.
        //  Still, I'd like a way to make sure we get all the right errors and
        //  would prefer to not write 6 different tests.
        expect(err.message).to.equal(
          'Errors found in schema: Missing type in root.field1 schema. Missing object properties in root.field2 schema. Missing type in root.field3.nestedField schema. Missing items schema in root.field4. Missing object properties in root.field5.additionalItems schema. Missing type in root.field6.items.0 schema. Missing type in root.field7.items schema. root.field8 should contain additionalItems when items is an array. root.field9 should not contain additionalItems when items is an object.',
        );
      }
      expect(isValid).to.equal(undefined);
    });
  });
  describe('expandArrayPages', () => {
    it('should expand array page for single item', () => {
      const pageList = [
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'test/:index',
        },
      ];
      const data = {
        test: [{}],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(data.test.length);
      expect(newPageList[0].path).to.equal('test/0');
      expect(newPageList[0].index).to.equal(0);
    });
    it('should expand array page for multiple items', () => {
      const pageList = [
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'test/:index',
        },
      ];
      const data = {
        test: [{}, {}],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(data.test.length);
      expect(newPageList[0].path).to.equal('test/0');
      expect(newPageList[0].index).to.equal(0);
      expect(newPageList[1].path).to.equal('test/1');
      expect(newPageList[1].index).to.equal(1);
    });
    it('should expand array pages in correct position in list', () => {
      const pageList = [
        {
          path: 'other-path',
        },
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'test/:index',
        },
        {
          path: 'some-path',
        },
      ];
      const data = {
        test: [{}],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(data.test.length + 2);
      expect(newPageList[0].showPagePerItem).not.to.be.true;
      expect(newPageList[1].path).to.equal('test/0');
      expect(newPageList[1].index).to.equal(0);
      expect(newPageList[2].showPagePerItem).not.to.be.true;
    });
    it('should expand multiple array pages', () => {
      const pageList = [
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'path/:index',
        },
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'other-path/:index',
        },
      ];
      const data = {
        test: [{}, {}],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(data.test.length * pageList.length);
      expect(newPageList[0].path).to.equal('path/0');
      expect(newPageList[1].path).to.equal('other-path/0');
      expect(newPageList[2].path).to.equal('path/1');
      expect(newPageList[3].path).to.equal('other-path/1');
    });
    it('should skip filtered out array pages', () => {
      const pageList = [
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'path/:index',
          itemFilter: data => !data.filterOut,
        },
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'other-path/:index',
        },
      ];
      const data = {
        test: [{ filterOut: true }, {}],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(3);
      expect(newPageList[0].path).to.equal('other-path/0');
      expect(newPageList[1].path).to.equal('path/1');
      expect(newPageList[2].path).to.equal('other-path/1');
    });
    it('should pass through list with no array pages', () => {
      const pageList = [
        {
          path: 'test',
        },
      ];
      const data = {
        test: [{}],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(pageList.length);
      expect(newPageList[0].path).to.equal('test');
    });
    it('should not generate array pages if array is empty', () => {
      const pageList = [
        {
          showPagePerItem: true,
          arrayPath: 'test',
          path: 'path/:index',
        },
        {
          path: 'test',
        },
      ];
      const data = {
        test: [],
      };

      const newPageList = expandArrayPages(pageList, data);

      expect(newPageList.length).to.equal(pageList.length - 1);
      expect(newPageList[0].path).to.equal('test');
    });
  });
  describe('formatReviewDate', () => {
    it('should format full date', () => {
      expect(formatReviewDate('2010-01-01')).to.equal('01/01/2010');
    });
    it('should format partial date', () => {
      expect(formatReviewDate('2010-01-XX')).to.equal('01/XX/2010');
    });
    it('should format month year date', () => {
      expect(formatReviewDate('2010-01-XX', true)).to.equal('01/2010');
    });
    it('should format full date (no dashes)', () => {
      expect(formatReviewDate('20100102')).to.equal('01/02/2010');
    });
    it('should format partial date (no dashes)', () => {
      expect(formatReviewDate('201001XX')).to.equal('01/XX/2010');
    });
    it('should format month year date (no dashes)', () => {
      expect(formatReviewDate('201001XX', true)).to.equal('01/2010');
    });
  });
  describe('omitRequired', () => {
    it('should omit all required arrays', () => {
      const schema = {
        type: 'object',
        properties: {
          field1: {
            type: 'object',
            properties: {
              nestedField: {
                type: 'string',
                enum: ['option1', 'option2'],
              },
            },
            required: ['nestedField'],
          },
        },
        required: ['field1'],
      };
      const expected = {
        type: 'object',
        properties: {
          field1: {
            type: 'object',
            properties: {
              nestedField: {
                type: 'string',
                enum: ['option1', 'option2'],
              },
            },
          },
        },
      };
      expect(omitRequired(schema)).to.eql(expected);
    });
  });

  describe('showReviewField', () => {
    it('should show visible field', () => {
      expect(
        showReviewField(
          'field1',
          {
            properties: {
              field1: {
                type: 'boolean',
              },
            },
          },
          {},
          {},
          {},
        ),
      ).to.eql(true);
    });
    it('should not show field using hiddenOnSchema', () => {
      expect(
        showReviewField(
          'field1',
          {
            properties: {
              field1: {
                type: 'boolean',
                'ui:hidden': true,
              },
            },
          },
          {},
          {},
          {},
        ),
      ).to.eql(false);
    });

    it('should not show field using collapsedOnSchema', () => {
      expect(
        showReviewField(
          'field1',
          {
            properties: {
              field1: {
                type: 'boolean',
                'ui:collapsed': true,
              },
            },
          },
          {},
          {},
          {},
        ),
      ).to.eql(false);
    });

    it('should not show field using ui schema hideOnReview', () => {
      expect(
        showReviewField(
          'field1',
          {
            properties: {
              field1: {
                type: 'boolean',
              },
            },
          },
          {
            field1: {
              'ui:options': {
                hideOnReview: true,
              },
            },
          },
          {},
          {},
        ),
      ).to.eql(false);
    });

    it('should not show field using ui schema hideOnReview function', () => {
      expect(
        showReviewField(
          'field1',
          {
            properties: {
              field1: {
                type: 'boolean',
              },
            },
          },
          {
            field1: {
              'ui:options': {
                hideOnReview: () => true,
              },
            },
          },
          {},
          {},
        ),
      ).to.eql(false);
    });

    it('should not show field using ui schema hideOnReviewIfFalse', () => {
      expect(
        showReviewField(
          'field1',
          {
            properties: {
              field1: {
                type: 'boolean',
              },
            },
          },
          {
            field1: {
              'ui:options': {
                hideOnReviewIfFalse: true,
              },
            },
          },
          { field1: false },
          {},
        ),
      ).to.eql(false);
    });
  });
});

describe('stringifyUrlParams ', () => {
  it('should convert an object to a url query string', () => {
    expect(stringifyUrlParams(null)).to.eql('');
    expect(stringifyUrlParams({})).to.eql('');
    expect(
      stringifyUrlParams({
        add: true,
      }),
    ).to.eql('?add=true');
    expect(
      stringifyUrlParams({
        time: '123',
        rate: 24,
      }),
    ).to.eql('?time=123&rate=24');
  });
});

describe('getUrlPathIndex', () => {
  it('should return the index of a url path', () => {
    expect(getUrlPathIndex(null)).to.eql(undefined);
    expect(getUrlPathIndex('/form-1/path-2')).to.eql(undefined);
    expect(getUrlPathIndex('form-1/path-2/0')).to.eql(0);
    expect(getUrlPathIndex('/form-1/path-2/3')).to.eql(3);
    expect(getUrlPathIndex('/form-1/path-2/3?add')).to.eql(3);
    expect(getUrlPathIndex('/form-1/path-2/0/the-page?add')).to.eql(0);
    expect(getUrlPathIndex('/form-1/path-2/1/page-3')).to.eql(1);
  });
});

describe('convertUrlPathToPageConfigPath', () => {
  it('should convert a url path to a page config path', () => {
    let urlPath;
    let expectedPagePath;
    expect(convertUrlPathToPageConfigPath(urlPath)).to.equal(expectedPagePath);

    urlPath = null;
    expectedPagePath = null;
    expect(convertUrlPathToPageConfigPath(urlPath)).to.equal(expectedPagePath);

    urlPath = '/veteran-information';
    expectedPagePath = 'veteran-information';
    expect(convertUrlPathToPageConfigPath(urlPath)).to.equal(expectedPagePath);

    urlPath = '/mental-health/0/events-details';
    expectedPagePath = 'mental-health/:index/events-details';
    expect(convertUrlPathToPageConfigPath(urlPath)).to.equal(expectedPagePath);

    urlPath = '/mental-health/0';
    expectedPagePath = 'mental-health/:index';
    expect(convertUrlPathToPageConfigPath(urlPath)).to.equal(expectedPagePath);

    urlPath = 'mental-health/0/';
    expectedPagePath = 'mental-health/:index';
    expect(convertUrlPathToPageConfigPath(urlPath)).to.equal(expectedPagePath);

    urlPath = '/root-form/specific-name/mental-health/0/events-details';
    let rootUrl = '/root-form/specific-name';
    expectedPagePath = 'mental-health/:index/events-details';
    expect(convertUrlPathToPageConfigPath(urlPath, rootUrl)).to.equal(
      expectedPagePath,
    );

    urlPath = '/root-form/specific-name/mental-health/0/events-details';
    rootUrl = 'root-form/specific-name/';
    expectedPagePath = 'mental-health/:index/events-details';
    expect(convertUrlPathToPageConfigPath(urlPath, rootUrl)).to.equal(
      expectedPagePath,
    );

    urlPath = 'root-form/specific-name/mental-health/0/events-details';
    rootUrl = '/root-form/specific-name/';
    expectedPagePath = 'mental-health/:index/events-details';
    expect(convertUrlPathToPageConfigPath(urlPath, rootUrl)).to.equal(
      expectedPagePath,
    );
  });
});
