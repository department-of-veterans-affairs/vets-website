import { expect } from 'chai';

import {
  reduceErrors,
  getPropertyInfo,
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
    expect(reduceErrors(raw, [])).to.eql([
      {
        name: 'bar',
        message: 'BAH',
        chapterKey: '',
        pageKey: '',
        index: null,
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
      },
      {
        name: 'deeplyNestedObj',
        message: 'Another error',
        chapterKey: 'fooIssues',
        pageKey: 'barIssues',
        index: null,
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
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
        message: 'instance requires property "view:baz"',
        chapterKey: 'bar',
        pageKey: 'zoo',
        index: null,
      },
      {
        name: 'city',
        message: 'instance.address requires property "city"',
        chapterKey: 'info',
        pageKey: 'contact',
        index: null,
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
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
        message: 'instance.news[0] requires property "cause"',
        chapterKey: 'diz',
        pageKey: 'news',
        index: '0',
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
        message: 'is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
        chapterKey: 'disabilities',
        pageKey: 'newDisabilityFollowUp',
      },
      {
        name: 'newDisabilities.view:secondaryFollowUp.causedByDisability',
        index: '6',
        message:
          'instance.newDisabilities[6].view:secondaryFollowUp.causedByDisability is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
        chapterKey: 'disabilities',
        pageKey: 'newDisabilityFollowUp',
      },
    ];
    expect(reduceErrors(raw, pages)).to.eql(result);
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
