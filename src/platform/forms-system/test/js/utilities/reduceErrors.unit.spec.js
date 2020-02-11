import { expect } from 'chai';

import { reduceErrors } from '../../../src/js/utilities/data/reduceErrors';

const chapters = {
  level1a: {
    pages: {
      uiSchema: {
        'view:error1': {},
      },
      schema: {
        // properties in schema should be ignored
        errorSix: {},
      },
    },
  },
  level1b: {
    pages: {
      page1: {
        uiSchema: {
          error2: {},
          cardWrapper: {
            error3: {},
            empty: {
              // errorFive: 'undefined'
            },
          },
          anotherCard: {
            'view:errorNumberFour': {},
          },
        },
      },
      page2: {
        uiSchema: {
          initialData: {
            // properties in initialData should be ignored
            errorFive: {},
          },
        },
      },
    },
  },
  level1c: {
    pages: {
      wrap1: {
        uiSchema: {
          wrap2: {
            errorSix: {},
          },
        },
      },
      wrap2: {
        uiSchema: {
          errorSeven: {},
        },
      },
    },
  },
};

const errors = [
  {
    noError1: {
      __errors: [],
    },
  },
  {
    wrapper1: {
      __errors: [],
      noError2: {
        __errors: [],
      },
    },
  },
  {
    property: 'instance',
    message: 'requires property "view:error1"',
    schema: {},
    name: 'required',
    argument: 'view:error1',
    stack: 'instance requires property "view:error1"',
  },
  {
    property: 'instance',
    message: 'requires property "error2"',
    schema: {},
    name: 'required',
    argument: 'error2',
    stack: 'instance requires property "error2"',
  },
  {},
  {
    'view:noError3': {
      __errors: [],
    },
    'view:wrapper2': {
      __errors: [],
      error3: {
        __errors: ['Please select at least one type of item'],
        'view:noError4': {
          __errors: [],
        },
      },
      'view:errorNumberFour': {
        __errors: [
          'errorNumberFour placeholder',
          'errorNumberFour does not match pattern',
        ],
      },
    },
  },
  {
    property: 'instance.card1',
    message: 'requires property "errorFive"',
    schema: {},
    name: 'required',
    argument: 'errorFive',
    stack: 'instance.card1 requires property "errorFive"',
  },
  {
    errorSix: {
      __errors: ['ErrorSix message'],
    },
  },
  {
    property: 'instance.wrap2',
    message: 'requires property "errorSeven"',
    schema: {},
    name: 'required',
    argument: 'errorSeven',
    stack: 'instance.wrap2 requires property "errorSeven"',
  },
];

const result = [
  {
    name: 'view:error1',
    message: 'Error 1',
    chapter: 'level1a',
    // No page value, the uiSchema is directly under page; is this possible?
    page: '',
    index: 0,
  },
  {
    name: 'error2',
    message: 'Error 2',
    chapter: 'level1b',
    page: 'page1',
    index: 1,
  },
  {
    name: 'error3',
    message: 'Please select at least one type of item',
    chapter: 'level1b',
    page: 'page1',
    index: 1,
  },
  {
    name: 'view:errorNumberFour',
    message:
      'Error number four placeholder. Error number four does not match pattern',
    chapter: 'level1b',
    page: 'page1',
    index: 1,
  },
  {
    name: 'errorFive',
    message: 'Card 1 error five',
    chapter: '',
    page: '',
    index: -1,
  },
  {
    name: 'errorSix',
    message: 'Error six message',
    chapter: 'level1c',
    page: 'wrap1',
    index: 2,
  },
  {
    name: 'errorSeven',
    message: 'Wrap 2 error seven',
    chapter: 'level1c',
    page: 'wrap2',
    index: 2,
  },
];

describe('Process form validation errors', () => {
  it('should process the JSON schema form errors into', () => {
    expect(reduceErrors(errors, { chapters })).to.eql(result);
  });
});
