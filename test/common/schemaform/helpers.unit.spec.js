import { expect } from 'chai';

import {
  parseISODate,
  formatISOPartialDate,
  updateRequiredFields,
  createRoutes,
  hasFieldsOtherThanArray
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
});
