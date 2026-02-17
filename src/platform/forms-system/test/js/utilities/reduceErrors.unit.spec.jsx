import { expect } from 'chai';

import {
  reduceErrors,
  getPropertyInfo,
  replaceNumberWithWord,
  formatErrors,
} from '../../../src/js/utilities/data/reduceErrors';

describe('Process form validation errors', () => {
  it('should ignore empty data', () => {
    const pages = [];
    const raw = [];
    const result = [];
    expect(reduceErrors(raw, pages)).to.eql(result);
  });
  it('should ignore empty error messages', () => {
    const raw = [
      {},
      {
        'view:foo': {
          __errors: [],
        },
        bar: {
          __errors: [],
        },
        uiSchema: {
          bar: {}, // ignored since it's not the correct instance
        },
      },
      {
        'view:baz': {
          __errors: [],
          bing: {
            __errors: [],
          },
        },
      },
    ];
    expect(reduceErrors(raw, [])).to.eql([]);
  });
  it('should return error messages with empty pageList data', () => {
    const raw = [
      {},
      {
        'view:foo': {
          __errors: [],
        },
        bar: {
          __errors: ['BAH'],
        },
      },
    ];
    expect(reduceErrors(raw, [])).to.deep.equal([
      {
        name: 'bar',
        message: 'BAH',
        chapterKey: '',
        pageKey: '',
        index: null,
        navigationType: 'edit',
      },
    ]);
  });
  it('should process __errors message', () => {
    const pages = [
      {
        title: 'Issues',
        path: '/issues',
        uiSchema: {
          'ui:title': ' ',
          issues: {
            'ui:title': ' ',
            'ui:description': '',
            'ui:field': 'StringField',
            'ui:options': {},
          },
          moreIssues: {
            nestedObj: {
              deeplyNestedObj: {},
            },
          },
          'view:alert': {},
          'view:explanation': {
            'ui:description': '',
          },
        },
        schema: {},
        chapterTitle: 'Issues',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
      },
    ];
    const raw = [
      {
        issues: {
          __errors: ['Please select an issue'],
        },
        moreIssues: {
          nestedObj: {
            deeplyNestedObj: {
              __errors: ['Another error'],
            },
          },
        },
      },
    ];
    const result = [
      {
        name: 'issues',
        message: 'Please select an issue',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
        navigationType: 'edit',
      },
      {
        name: 'deeplyNestedObj',
        message: 'Another error',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
  });
  it('should process __errors message but return override values', () => {
    const pages = [
      {
        title: 'Issues',
        path: '/issues',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Issues',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
      },
    ];
    const raw = [
      {
        issues: {
          __errors: ['Please select an issue'],
        },
        moreIssues: {
          nestedObj: {
            deeplyNestedObj: {
              __errors: ['Another error'],
            },
          },
        },
      },
    ];
    const reviewErrors = {
      _override: err => {
        if (err === 'issues' || err === 'deeplyNestedObj') {
          return { chapterKey: 'fooIssues', pageKey: 'barIssues' };
        }
        return null;
      },
    };
    const result = [
      {
        name: 'issues',
        message: 'Please select an issue',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
        navigationType: 'edit',
      },
      {
        name: 'deeplyNestedObj',
        message: 'Another error',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should include navigationType from _override return value', () => {
    const pages = [
      {
        title: 'Issues',
        path: '/issues',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Issues',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
      },
    ];
    const raw = [
      {
        issues: {
          __errors: ['Please select an issue'],
        },
      },
    ];
    const reviewErrors = {
      _override: err => {
        if (err === 'issues') {
          return {
            chapterKey: 'fooIssues',
            pageKey: 'barIssues',
            navigationType: 'redirect',
          };
        }
        return null;
      },
    };
    const result = [
      {
        name: 'issues',
        message: 'Please select an issue',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
        navigationType: 'redirect',
      },
    ];
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should default navigationType to edit when not provided in _override', () => {
    const pages = [
      {
        title: 'Issues',
        path: '/issues',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Issues',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
      },
    ];
    const raw = [
      {
        issues: {
          __errors: ['Please select an issue'],
        },
      },
    ];
    const reviewErrors = {
      _override: err => {
        if (err === 'issues') {
          return { chapterKey: 'fooIssues', pageKey: 'barIssues' };
        }
        return null;
      },
    };
    const result = [
      {
        name: 'issues',
        message: 'Please select an issue',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should process object instance messages', () => {
    const pages = [
      {
        title: 'Abc',
        path: '/abc',
        uiSchema: {
          'view:baz': {
            'ui:title': '',
            'ui:widget': 'yesNo',
            'ui:options': {},
          },
        },
        schema: {},
        // initialData content is ignored
        initialData: {
          address: {
            city: '',
          },
        },
        chapterKey: 'bar',
        pageKey: 'zoo',
      },
      {
        title: 'contact',
        path: '/contact',
        uiSchema: {
          'ui:title': 'Contact info',
          address: {
            'ui:title': 'Address',
            city: {},
            state: {},
          },
        },
        schema: {},
        // initialData content is ignored
        initialData: {
          'view:baz': {},
        },
        chapterTitle: 'Info',
        chapterKey: 'info',
        pageKey: 'contact',
      },
    ];
    const raw = [
      {
        property: 'instance',
        message: 'requires property "view:baz"',
        schema: {},
        name: 'required',
        argument: 'view:baz',
        stack: 'instance requires property "view:baz"',
      },
      {
        property: 'instance.address',
        message: 'requires property "city"',
        schema: {},
        name: 'required',
        argument: 'city',
        stack: 'instance.address requires property "city"',
      },
    ];
    const result = [
      {
        name: 'view:baz',
        message: 'Baz',
        chapterKey: 'bar',
        pageKey: 'zoo',
        index: null,
        navigationType: 'edit',
      },
      {
        name: 'city',
        message: 'Address city',
        chapterKey: 'info',
        pageKey: 'contact',
        index: null,
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
  });
  it('should process object instance messages but return override values', () => {
    const pages = [
      {
        title: 'Abc',
        path: '/abc',
        uiSchema: {},
        schema: {},
        chapterKey: 'bar',
        pageKey: 'zoo',
      },
      {
        title: 'contact',
        path: '/contact',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Info',
        chapterKey: 'info',
        pageKey: 'contact',
      },
    ];
    const raw = [
      {
        property: 'instance',
        message: 'requires property "view:baz"',
        schema: {},
        name: 'required',
        argument: 'view:baz',
        stack: 'instance requires property "view:baz"',
      },
      {
        property: 'instance.address',
        message: 'requires property "city"',
        schema: {},
        name: 'required',
        argument: 'city',
        stack: 'instance.address requires property "city"',
      },
    ];
    const reviewErrors = {
      _override: err => {
        if (err === 'address') {
          return { chapterKey: 'info', pageKey: 'contact' };
        }
        if (err.includes('view:baz')) {
          return { chapterKey: 'bar', pageKey: 'zoo' };
        }
        return null;
      },
    };
    const result = [
      {
        name: 'view:baz',
        message: 'Baz',
        chapterKey: 'bar',
        pageKey: 'zoo',
        index: null,
        navigationType: 'edit',
      },
      {
        name: 'city',
        message: 'Address city',
        chapterKey: 'info',
        pageKey: 'contact',
        index: null,
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should process array instance messages', () => {
    const pages = [
      {
        path: '/news/follow-up/:index',
        showPagePerItem: true,
        arrayPath: 'news',
        uiSchema: {
          'ui:title': 'Details',
          news: {
            items: {
              cause: {
                'ui:title': {},
                'ui:widget': 'radio',
                'ui:options': {},
              },
            },
          },
        },
        schema: {},
        chapterTitle: 'Diz',
        chapterKey: 'diz',
        pageKey: 'news',
      },
    ];
    const raw = [
      {
        property: 'instance.news[0]',
        message: 'requires property "cause"',
        schema: {},
        name: 'required',
        argument: 'cause',
        stack: 'instance.news[0] requires property "cause"',
      },
    ];
    const result = [
      {
        name: 'cause',
        message: 'First news cause',
        chapterKey: 'diz',
        pageKey: 'news',
        index: '0',
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
  });
  it('should process array instance messages but return override values', () => {
    const pages = [
      {
        path: '/news/follow-up/:index',
        showPagePerItem: true,
        arrayPath: 'news',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Diz',
        chapterKey: 'diz',
        pageKey: 'news',
      },
    ];
    const raw = [
      {
        property: 'instance.news[0]',
        message: 'requires property "cause"',
        schema: {},
        name: 'required',
        argument: 'cause',
        stack: 'instance.news[0] requires property "cause"',
      },
    ];
    const reviewErrors = {
      _override: err => {
        if (err.startsWith('news[')) {
          return { chapterKey: 'diz', pageKey: 'news' };
        }
        return null;
      },
    };
    const result = [
      {
        name: 'cause',
        message: 'First news cause',
        chapterKey: 'diz',
        pageKey: 'news',
        index: '0',
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should process array instance messages but return override values', () => {
    const pages = [
      {
        path: '/news/0',
        showPagePerItem: true,
        arrayPath: 'news',
        uiSchema: {},
        schema: {},
        chapterTitle: 'Diz',
        chapterKey: 'diz',
        pageKey: 'news',
      },
    ];
    const raw = [{ testing: { 0: { __errors: ['Test foo'] } } }];
    const reviewErrors = {
      _override: (err, fullError) => {
        if (/^\d+$/.test(err) && fullError.__errors.includes('Test foo')) {
          return { chapterKey: 'diz', pageKey: `news${err}` };
        }
        return null;
      },
    };
    const result = [
      {
        name: '0',
        message: 'Test foo',
        chapterKey: 'diz',
        pageKey: 'news0',
        index: '0',
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should process minimum array length', () => {
    const pages = [
      {
        path: '/news/follow-up/:index',
        showPagePerItem: true,
        arrayPath: 'news',
        uiSchema: {
          'ui:title': 'Details',
          news: {
            items: {
              cause: {
                'ui:title': {},
                'ui:widget': 'radio',
                'ui:options': {},
              },
            },
          },
        },
        schema: {},
        chapterTitle: 'Diz',
        chapterKey: 'diz',
        pageKey: 'news',
      },
    ];
    const raw = [
      {
        property: 'instance.news',
        message: 'does not meet minimum length of 1',
        schema: {},
        name: 'minItems',
        argument: 1,
        stack: 'instance.news does not meet minimum length of 1',
      },
    ];
    const result = [
      {
        name: 'news',
        message: 'News does not meet minimum length of 1',
        chapterKey: 'diz',
        pageKey: 'news',
        index: null,
        navigationType: 'edit',
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
  });
  it('should process enum list with same name/different index', () => {
    const pages = [
      {
        path: '/new-disabilities/follow-up/:index',
        showPagePerItem: true,
        arrayPath: 'newDisabilities',
        uiSchema: {
          'ui:title': 'Details',
          newDisabilities: {
            items: {
              cause: {
                'ui:title': 'Cause?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {},
                },
              },
              primaryDescription: {
                'ui:title': '',
                'ui:widget': 'textarea',
                'ui:options': {
                  expandUnder: 'cause',
                  expandUnderCondition: 'NEW',
                },
                'ui:validations': [null],
              },
              'view:secondaryFollowUp': {
                'ui:options': {
                  expandUnder: 'cause',
                  expandUnderCondition: 'SECONDARY',
                },
                causedByDisability: {
                  'ui:title': '',
                  'ui:options': {
                    labels: {},
                  },
                },
              },
              'view:serviceConnectedDisability': {},
            },
          },
        },
        schema: {},
        chapterTitle: 'Disabilities',
        chapterKey: 'disabilities',
        pageKey: 'newDisabilityFollowUp',
      },
    ];
    const raw = [
      {
        // no argument, name or stack (reproduced locally)
        property:
          'instance.newDisabilities[4].view:secondaryFollowUp.causedByDisability',
        message: 'is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
        schema: {},
      },
      {
        // modified from Sentry error
        argument: ['Abc', 'Bcd', 'Cde', 'Def', 'Efg', 'Fgh', 'Ghi', 'Hij'],
        message: 'is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
        name: 'enum',
        property:
          'instance.newDisabilities[6].view:secondaryFollowUp.causedByDisability',
        schema: {},
        stack:
          'instance.newDisabilities[6].view:secondaryFollowUp.causedByDisability is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
      },
    ];
    const result = [
      {
        name: 'newDisabilities.view:secondaryFollowUp.causedByDisability',
        index: '4',
        message: 'Fifth new disability is missing a value',
        chapterKey: 'disabilities',
        pageKey: 'newDisabilityFollowUp',
        navigationType: 'edit',
      },
      {
        name: 'newDisabilities.view:secondaryFollowUp.causedByDisability',
        index: '6',
        message:
          'Seventh newDisabilities.secondaryFollowUp.causedByDisability is not one of the available values',
        chapterKey: 'disabilities',
        pageKey: 'newDisabilityFollowUp',
        navigationType: 'edit',
      },
    ];
    const reviewErrors = {
      'newDisabilities.view:secondaryFollowUp.causedByDisability': index =>
        index === 4 ? 'Fifth new disability is missing a value' : null,
    };
    expect(reduceErrors(raw, pages, reviewErrors)).to.eql(result);
  });

  it('should handle error with undefined property', () => {
    const pages = [
      {
        title: 'Test',
        path: '/test',
        uiSchema: {
          testField: {},
        },
        schema: {},
        chapterKey: 'testChapter',
        pageKey: 'testPage',
      },
    ];
    const raw = [
      {
        property: undefined,
        message: 'test error',
        stack: 'test error stack',
      },
    ];
    // Should not throw and should return empty array since property is undefined
    expect(() => reduceErrors(raw, pages)).to.not.throw();
    expect(reduceErrors(raw, pages)).to.eql([]);
  });

  it('should use fallback message when stack and message are undefined', () => {
    const pages = [
      {
        title: 'Test',
        path: '/test',
        uiSchema: {
          testField: {},
        },
        schema: {},
        chapterKey: 'testChapter',
        pageKey: 'testPage',
      },
    ];
    const raw = [
      {
        property: 'instance.testField',
        name: 'error',
      },
    ];
    const result = reduceErrors(raw, pages);
    expect(result[0].message).to.equal('Validation error');
  });
});

describe('getPropertyInfo', () => {
  it('should return an empty object if page is not found', () => {
    const info = getPropertyInfo([], 'test');
    expect(info).to.deep.equal({});
  });
  it('should find the page with the named property in the schema object', () => {
    const pageList = [
      {
        title: 'Abc',
        path: '/abc',
        uiSchema: {
          'view:baz': {
            'ui:title': '',
            'ui:widget': 'yesNo',
            'ui:options': {},
          },
        },
        schema: {},
        // initialData content is ignored
        initialData: {
          address: {
            city: '',
          },
        },
        chapterKey: 'bar',
        pageKey: 'zoo',
      },
      {
        title: 'contact',
        path: '/contact',
        uiSchema: {
          'ui:title': 'Contact info',
          address: {
            'ui:title': 'Address',
            city: {},
            state: {},
          },
        },
        schema: {},
        // initialData content is ignored
        initialData: {
          'view:baz': {},
        },
        chapterTitle: 'Info',
        chapterKey: 'info',
        pageKey: 'contact',
      },
    ];
    const property = 'instance.address';
    const info = getPropertyInfo(pageList, 'city', property);
    expect(info).to.deep.equal(pageList[1]);
  });
  it('should find the page with the named property in a schema array', () => {
    const pageList = [
      {},
      {},
      {
        path: '/news/follow-up/:index',
        showPagePerItem: true,
        arrayPath: 'news',
        uiSchema: {
          'ui:title': 'Details',
          news: {
            items: {
              cause: {
                'ui:title': {},
                'ui:widget': 'radio',
                'ui:options': {},
              },
            },
          },
        },
        schema: {},
        chapterTitle: 'Diz',
        chapterKey: 'diz',
        pageKey: 'news',
      },
    ];
    const property = 'instance.news[2]';
    const info = getPropertyInfo(pageList, 'cause', property);
    expect(info).to.deep.equal(pageList[2]);
  });
  it('should find the page with the named property in a deeply nested schema', () => {
    const pageList = [
      {
        path: '/new-disabilities/follow-up/:index',
        showPagePerItem: true,
        arrayPath: 'newDisabilities',
        uiSchema: {
          'ui:title': 'Details',
          newDisabilities: {
            items: {
              cause: {
                'ui:title': 'Cause?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {},
                },
              },
              primaryDescription: {
                'ui:title': '',
                'ui:widget': 'textarea',
                'ui:options': {
                  expandUnder: 'cause',
                  expandUnderCondition: 'NEW',
                },
                'ui:validations': [null],
              },
              'view:secondaryFollowUp': {
                'ui:options': {
                  expandUnder: 'cause',
                  expandUnderCondition: 'SECONDARY',
                },
                causedByDisability: {
                  'ui:title': '',
                  'ui:options': {
                    labels: {},
                  },
                },
              },
              'view:serviceConnectedDisability': {},
            },
          },
        },
        schema: {},
        chapterTitle: 'Disabilities',
        chapterKey: 'disabilities',
        pageKey: 'newDisabilityFollowUp',
      },
    ];
    const property =
      'instance.newDisabilities[4].view:secondaryFollowUp.causedByDisability';
    const info = getPropertyInfo(pageList, 'causedByDisability', property);
    expect(info).to.deep.equal(pageList[0]);
  });
});

describe('replaceNumberWithWord', () => {
  it('should return an oridanal word name', () => {
    const string = replaceNumberWithWord(null, 'test', '0');
    expect(string).to.equal('first test');
  });
  it('should return original text if not a number', () => {
    const string = replaceNumberWithWord(null, 'test', 'foo');
    expect(string).to.equal('foo test');
  });
  it('should return an original non-number', () => {
    const string = replaceNumberWithWord(null, 'test', 'Infinity');
    expect(string).to.equal('Infinity test');
  });
  it('should return empty string + word', () => {
    const string = replaceNumberWithWord(null, 'test', '');
    expect(string).to.equal(' test');
  });
});

describe('formatErrors', () => {
  it('should return an untouched string', () => {
    const string =
      '_this is a test of property requires view of a string with 0 random enum values';
    const result = formatErrors(string);
    expect(result).to.equal(string);
  });
  it('should trim spaces', () => {
    const result = formatErrors('    ');
    expect(result).to.equal('');
  });
  it('should capitalize the first letter', () => {
    const result = formatErrors('abcd');
    expect(result).to.equal('Abcd');
  });
  it('should remove "requires property" and "instance"', () => {
    const result = formatErrors('requires property instance');
    expect(result).to.equal('');
  });
  it('should remove "view:" and "ui:" prefixes (and capitalize "Foo")', () => {
    const result = formatErrors('view:foo ui:baz');
    expect(result).to.equal('Foo baz');
  });
  it('should replace an JS array bracketed number with a word', () => {
    const result = formatErrors('test[0]');
    expect(result).to.equal('First test');
  });
  it('should separate letter+number combos', () => {
    const result = formatErrors('a1b2c3');
    expect(result).to.equal('A 1 b 2 c 3');
  });
  it('should replace "zip code" with "postal code"', () => {
    const result = formatErrors('a zip code');
    expect(result).to.equal('A postal code');
  });
  it('should capitalize "VA" and "POW"', () => {
    const result = formatErrors('eva va power pow vac epow');
    expect(result).to.equal('Eva  VA  power  POW  vac epow');
  });
  it('should strip off the ending after an enum list', () => {
    const result = formatErrors(
      'x is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
    );
    expect(result).to.equal('X is not one of the available values');
  });
});
