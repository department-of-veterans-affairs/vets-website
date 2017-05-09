import { expect } from 'chai';

import {
  parseISODate,
  formatISOPartialDate,
  createRoutes,
  hasFieldsOtherThanArray,
  transformForSubmit,
  getArrayFields,
  setItemTouched,
  getNonArraySchema,
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
    it('should not get hidden array', () => {
      const data = {
        schema: {
          type: 'array',
          'ui:hidden': true
        },
        uiSchema: {}
      };

      const fields = getArrayFields(data);

      expect(fields).to.be.empty;
    });
    it('should not get array in hidden object', () => {
      const data = {
        schema: {
          type: 'object',
          'ui:collapsed': true,
          properties: {
            field: {
              type: 'array'
            }
          }
        },
        uiSchema: {}
      };

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
              page2: {}
            }
          }
        }
      };
      const formData = {
        data: {
          otherField: 'testing2',
          field: 'testing'
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
        data: {
          otherField: 'testing2',
          field: 'testing'
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
        data: {
          'view:Test': 'thing'
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
        data: {
          'view:Test': {
            field: 'testing'
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
                schema: {
                  type: 'object',
                  properties: {
                    otherField: {
                      type: 'string'
                    }
                  }
                },
                depends: {
                  field: 'something'
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
        data: {
          otherField: 'testing2',
          field: 'testing'
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
        data: {
          address: {
            country: 'testing'
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.address).to.be.undefined;
    });
    it('should remove empty objects', () => {
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
        data: {
          someField: {
          },
          someField2: {
            someData: undefined
          }
        }
      };

      const output = JSON.parse(transformForSubmit(formConfig, formData));

      expect(output.someField).to.be.undefined;
      expect(output.someField2).to.be.undefined;
    });
  });
  describe('setItemTouched', () => {
    /* eslint-disable camelcase */
    it('should set field as touched', () => {
      const touched = setItemTouched('root', 0, {
        $id: 'root_field'
      });

      expect(touched).to.eql({
        root_0_field: true
      });
    });
    it('should set nested field as touched', () => {
      const touched = setItemTouched('root', 0, {
        $id: 'root',
        field: {
          $id: 'root_field'
        }
      });

      expect(touched).to.eql({
        root_0_field: true
      });
    });
    /* eslint-enable camelcase */
  });
  describe('getNonArraySchema', () => {
    it('should return undefined if array', () => {
      const result = getNonArraySchema({ type: 'array' });

      expect(result).to.be.undefined;
    });
    it('should return undefined if nested array', () => {
      const result = getNonArraySchema({
        type: 'object',
        properties: {
          field: {
            type: 'array'
          }
        }
      });

      expect(result).to.be.undefined;
    });
    it('should return fields without array', () => {
      const result = getNonArraySchema({
        type: 'object',
        required: ['field', 'field2'],
        properties: {
          field: {
            type: 'string'
          },
          field2: {
            type: 'array'
          }
        }
      });

      expect(result).to.eql({
        type: 'object',
        required: ['field'],
        properties: {
          field: {
            type: 'string'
          }
        }
      });
    });
  });
});
