import sinon from 'sinon-v20';
import { expect } from 'chai';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import {
  subscribeToArrayBuilderEvent,
  ARRAY_BUILDER_EVENTS,
} from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderEvents';
import * as routing from 'platform/forms-system/src/js/routing';
import { DEFAULT_ARRAY_BUILDER_TEXT } from '../arrayBuilderText';
import * as helpers from '../helpers';

describe('arrayBuilder helpers', () => {
  afterEach(() => sinon.restore());

  it('onNavBackRemoveAddingItem returned to intro if items are 0', () => {
    const goPath = sinon.spy();
    const setFormData = sinon.spy();
    helpers.onNavBackRemoveAddingItem({
      arrayPath: 'employers',
      getSummaryPath: () => '/summary',
      getIntroPath: () => '/intro',
    })({
      setFormData,
      goPath,
      formData: {
        employers: [{ name: 'Test' }],
      },
      urlParams: {
        add: true,
      },
    });

    expect(setFormData.calledWith({ employers: [] })).to.be.true;
    expect(goPath.calledWith('/intro')).to.be.true;
  });

  it('onNavBackRemoveAddingItem returned to summary if items are > 0', () => {
    const goPath = sinon.spy();
    const setFormData = sinon.spy();
    helpers.onNavBackRemoveAddingItem({
      arrayPath: 'employers',
      getSummaryPath: () => '/summary',
      getIntroPath: () => '/intro',
    })({
      setFormData,
      goPath,
      formData: {
        employers: [{ name: 'Test' }, { name: 'Test 2' }],
      },
      urlParams: {
        add: true,
      },
    });

    expect(setFormData.calledWith({ employers: [{ name: 'Test' }] })).to.be
      .true;
    expect(goPath.calledWith('/summary')).to.be.true;
  });

  it('onNavBackRemoveAddingItem returned to summary regardless of item count, if intro does not exist', () => {
    const goPath = sinon.spy();
    const setFormData = sinon.spy();
    helpers.onNavBackRemoveAddingItem({
      arrayPath: 'employers',
      getSummaryPath: () => '/summary',
    })({
      setFormData,
      goPath,
      formData: {
        employers: [{ name: 'Test' }],
      },
      urlParams: {
        add: true,
      },
    });

    expect(setFormData.calledWith({ employers: [] })).to.be.true;
    expect(goPath.calledWith('/summary')).to.be.true;
  });

  it('onNavBackRemoveAddingItem should not modify data if array is empty', () => {
    const goPath = sinon.spy();
    const setFormData = sinon.spy();
    helpers.onNavBackRemoveAddingItem({
      arrayPath: 'employers',
      getSummaryPath: () => '/summary',
    })({
      setFormData,
      goPath,
      formData: {
        employers: [],
      },
      urlParams: {
        add: true,
      },
    });

    expect(setFormData.called).to.be.false;
    expect(goPath.calledWith('/summary')).to.be.true;
  });

  it('onNavBackRemoveAddingItem should not modify data if we are on the edit page', () => {
    const goPath = sinon.spy();
    const setFormData = sinon.spy();
    helpers.onNavBackRemoveAddingItem({
      arrayPath: 'employers',
      getSummaryPath: () => '/summary',
    })({
      setFormData,
      goPath,
      formData: {
        employers: [{ name: 'Test' }],
      },
      urlParams: {
        edit: true,
      },
    });

    expect(setFormData.called).to.be.false;
    expect(goPath.calledWith('/summary')).to.be.true;
  });

  it('onNavForwardKeepUrlParams with edit true', () => {
    const goNextPath = sinon.spy();
    helpers.onNavForwardKeepUrlParams({
      goNextPath,
      urlParams: {
        edit: true,
      },
    });

    expect(goNextPath.calledWith({ edit: true })).to.be.true;
  });

  it('onNavForwardKeepUrlParams with add true', () => {
    const goNextPath = sinon.spy();
    helpers.onNavForwardKeepUrlParams({
      goNextPath,
      urlParams: {
        add: true,
      },
    });

    expect(goNextPath.calledWith({ add: true })).to.be.true;
  });

  it('onNavBackKeepUrlParams with edit true', () => {
    const goPreviousPath = sinon.spy();
    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      urlParams: { edit: true },
    });

    expect(goPreviousPath.calledWith({ edit: true })).to.be.true;
  });

  it('onNavBackKeepUrlParams with add true', () => {
    const goPreviousPath = sinon.spy();
    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      urlParams: { add: true },
    });

    expect(goPreviousPath.calledWith({ add: true })).to.be.true;
  });

  it('onNavBackKeepUrlParams - skips back into the nearest prior summary when prev is a per-item page and current is non-item', () => {
    const goPreviousPath = sinon.spy();
    const goPath = sinon.spy();

    // pages: [summary, itemA, itemB, currentNonItem]
    const pages = [
      { path: '/loop-a/summary', isArrayBuilderSummary: true },
      { path: '/loop-a/:index/info', showPagePerItem: true },
      { path: '/loop-a/:index/address', showPagePerItem: true },
      { path: '/next-after-summary' }, // <-- current page
    ];

    // Stub routing.getEligiblePages to shape the active flow
    const getEligiblePagesStub = sinon
      .stub(routing, 'getEligiblePages')
      .returns({ pages, pageIndex: 3 }); // current = pages[3], prev = pages[2] (per-item)

    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      goPath,
      pageList: [], // not used by our stub
      formData: {}, // not used by our stub
      pathname: '/next-after-summary',
      urlParams: { foo: 'bar' },
    });

    expect(getEligiblePagesStub.calledOnce).to.be.true;
    expect(goPreviousPath.called).to.be.false;
    expect(goPath.calledOnce).to.be.true;

    const arg = goPath.firstCall.args[0];
    expect(arg).to.match(/^\/loop-a\/summary(\?|$)/); // landed on summary (params preserved)
  });

  it('onNavBackKeepUrlParams - falls back to normal previous when CURRENT page is per-item (inside the loop)', () => {
    const goPreviousPath = sinon.spy();
    const goPath = sinon.spy();

    const pages = [
      { path: '/loop-a/summary', isArrayBuilderSummary: true },
      { path: '/loop-a/:index/info', showPagePerItem: true }, // prev
      { path: '/loop-a/:index/confirm', showPagePerItem: true }, // current
    ];

    sinon.stub(routing, 'getEligiblePages').returns({ pages, pageIndex: 2 });

    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      goPath,
      pageList: [],
      formData: {},
      pathname: '/loop-a/0/confirm',
      urlParams: { baz: 'qux' },
    });

    expect(goPreviousPath.calledOnceWith({ baz: 'qux' })).to.be.true;
    expect(goPath.called).to.be.false;
  });

  it('onNavBackKeepUrlParams - falls back to normal previous when prev is per-item but no prior summary exists', () => {
    const goPreviousPath = sinon.spy();
    const goPath = sinon.spy();

    const pages = [
      { path: '/loop-a/:index/info', showPagePerItem: true }, // prev
      { path: '/after' }, // current (non-item)
    ];

    sinon.stub(routing, 'getEligiblePages').returns({ pages, pageIndex: 1 });

    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      goPath,
      pageList: [],
      formData: {},
      pathname: '/after',
      urlParams: { x: '1' },
    });

    expect(goPreviousPath.calledOnceWith({ x: '1' })).to.be.true;
    expect(goPath.called).to.be.false;
  });

  it('onNavBackKeepUrlParams - defaults to normal previous when pageIndex <= 0', () => {
    const goPreviousPath = sinon.spy();
    const goPath = sinon.spy();

    sinon
      .stub(routing, 'getEligiblePages')
      .returns({ pages: [{ path: '/only' }], pageIndex: 0 });

    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      goPath,
      pageList: [],
      formData: {},
      pathname: '/only',
      urlParams: { y: '2' },
    });

    expect(goPreviousPath.calledOnceWith({ y: '2' })).to.be.true;
    expect(goPath.called).to.be.false;
  });

  it('createArrayBuilderItemAddPath with review and warning', () => {
    const path = helpers.createArrayBuilderItemAddPath({
      path: '/path-item/:index',
      index: 0,
      isReview: true,
      removedAllWarn: true,
    });

    expect(path).to.eq('/path-item/0?add=true&review=true&removedAllWarn=true');
  });

  it('createArrayBuilderItemAddPath default', () => {
    const path = helpers.createArrayBuilderItemAddPath({
      path: '/path-item/:index/something',
      index: 1,
      isReview: false,
      removedAllWarn: false,
    });

    expect(path).to.eq('/path-item/1/something?add=true');
  });

  it('createArrayBuilderItemEditPath with review and warning', () => {
    const path = helpers.createArrayBuilderItemEditPath({
      path: '/path-item/:index',
      index: 0,
      isReview: true,
    });

    expect(path).to.eq('/path-item/0?edit=true&review=true');
  });

  it('createArrayBuilderItemEditPath default', () => {
    const path = helpers.createArrayBuilderItemEditPath({
      path: '/path-item/:index/something',
      index: 1,
      isReview: false,
    });

    expect(path).to.eq('/path-item/1/something?edit=true');
  });

  it('createArrayBuilderUpdatedPath', () => {
    const path = helpers.createArrayBuilderUpdatedPath({
      basePath: '/path-summary',
      arrayPath: 'employer',
      index: 0,
    });

    expect(path).to.eq('/path-summary?updated=employer-0');
  });

  it('isDeepEmpty', () => {
    expect(helpers.isDeepEmpty({})).to.be.true;
    expect(
      helpers.isDeepEmpty({
        something: null,
      }),
    ).to.be.true;
    expect(
      helpers.isDeepEmpty({
        something: [],
        somethingOther: {
          somethingElse: undefined,
        },
      }),
    ).to.be.true;
    expect(helpers.isDeepEmpty(null)).to.be.true;
  });

  it('getArrayUrlSearchParams', () => {
    const search = '?add=true';
    let urlParams = helpers.getArrayUrlSearchParams(search);
    expect(urlParams.get('add')).to.eq('true');

    urlParams = helpers.getArrayUrlSearchParams('');
    expect(urlParams.get('add')).to.eq(null);
  });

  it('getArrayIndexFromPathName', () => {
    const pathname =
      '/mock-simple-forms-patterns/array-multiple-page-builder/3/name-and-address';
    let index = helpers.getArrayIndexFromPathName(pathname);
    expect(index).to.eq(3);

    index = helpers.getArrayIndexFromPathName('asdf');
    expect(index).to.eq(undefined);
  });
});

describe('arrayBuilderText', () => {
  it('should match expected types', () => {
    const getText = helpers.initGetText({
      getItemName: item => item?.name,
      nounPlural: 'employers',
      nounSingular: 'employer',
      cancelEditDescription: 'cancelEditDescription',
      cancelAddDescription: props => props.nounPlural,
    });
    const nullableKeys = [
      'summaryTitleWithoutItems',
      'summaryDescription',
      'summaryDescriptionWithoutItems',
    ];
    Object.keys(DEFAULT_ARRAY_BUILDER_TEXT).forEach(key => {
      if (key === 'getItemName') {
        return;
      }
      if (nullableKeys.includes(key)) {
        expect(getText(key)).to.be.null;
      } else {
        expect(getText(key)).to.be.a('string');
      }
    });
    expect(getText).to.be.a('function');
  });

  it('should gracefully fail type errors for cardDescription', () => {
    const getText = helpers.initGetText({
      // getItemName is already gracefully handled in arrayBuilder.jsx
      getItemName: () => 'test',
      cardDescription: data => data.not.a.real.value,
      nounPlural: 'employers',
      nounSingular: 'employer',
    });

    expect(getText('getItemName')).to.eq('test');
    expect(getText('cardDescription')).to.eq('');
  });
});

describe('maxItemsHint', () => {
  let hint = helpers.maxItemsHint({
    arrayData: [],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add up to 5.');

  hint = helpers.maxItemsHint({
    arrayData: [{}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add 4 more employers.');

  hint = helpers.maxItemsHint({
    arrayData: [{}, {}, {}, {}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add 1 more employer.');

  hint = helpers.maxItemsHint({
    arrayData: [{}, {}, {}, {}, {}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add up to 5.');

  hint = helpers.maxItemsHint({
    arrayData: [],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 1,
  });
  expect(hint).to.eq('You can add up to 1.');
});

describe('getUpdatedItemFromPath', () => {
  it('should return null values if no updated param', () => {
    const updatedItem = helpers.getUpdatedItemFromPath('');
    expect(updatedItem.arrayPathSlug).to.eq(null);
    expect(updatedItem.index).to.eq(null);
  });

  it('should return expected values for an item', () => {
    const updatedItem = helpers.getUpdatedItemFromPath('?updated=employer-0');
    expect(updatedItem.arrayPathSlug).to.eq('employer');
    expect(updatedItem.index).to.eq(0);
  });

  it('should return expected values for an item with multi-word slug', () => {
    const updatedItem = helpers.getUpdatedItemFromPath(
      '?updated=treatment-records-2',
    );
    expect(updatedItem.arrayPathSlug).to.eq('treatment-records');
    expect(updatedItem.index).to.eq(2);
  });
});

describe('replaceItemInFormData', () => {
  it('should replace an item in the array and create new formData', () => {
    const formData = {
      otherField: 'test',
      otherObject: { test: 'test' },
      employers: [
        { name: 'Test', type: 'pdf' },
        { name: 'Test 2', type: 'jpg' },
      ],
    };

    const newItem = { name: 'Test 3', type: 'png' };

    const newFormData = helpers.replaceItemInFormData({
      formData,
      newItem,
      arrayPath: 'employers',
      index: 1,
    });

    expect(formData.employers[1].name).to.equal('Test 2');
    expect(newFormData.employers[1].name).to.equal('Test 3');
  });

  it('should fail gracefully if wrong index', () => {
    const formData = {
      otherField: 'test',
      otherObject: { test: 'test' },
      employers: [
        { name: 'Test', type: 'pdf' },
        { name: 'Test 2', type: 'jpg' },
      ],
    };

    const newItem = { name: 'Test 3', type: 'png' };

    const newFormData = helpers.replaceItemInFormData({
      formData,
      newItem,
      arrayPath: 'employers',
      index: 2,
    });

    expect(formData.employers[1].name).to.equal('Test 2');
    expect(newFormData.employers[1].name).to.equal('Test 2');
  });

  it('should fail gracefully if no form data', () => {
    const formData = {};
    const newItem = { name: 'Test 3', type: 'png' };

    const newFormData = helpers.replaceItemInFormData({
      formData,
      newItem,
      arrayPath: 'employers',
      index: 1,
    });

    expect(formData).to.deep.equal({});
    expect(newFormData).to.deep.equal({});
  });

  it('should fail gracefully if no array data', () => {
    const formData = {
      employers: undefined,
    };
    const newItem = { name: 'Test 3', type: 'png' };

    const newFormData = helpers.replaceItemInFormData({
      formData,
      newItem,
      arrayPath: 'employers',
      index: 0,
    });

    expect(formData.employers).to.equal(undefined);
    expect(newFormData.employers).to.equal(undefined);
  });
});

describe('slugifyText', () => {
  describe('nounSingular examples', () => {
    it('should handle single words', () => {
      expect(helpers.slugifyText('employer')).to.equal('employer');
      expect(helpers.slugifyText('dependent')).to.equal('dependent');
      expect(helpers.slugifyText('program')).to.equal('program');
    });

    it('should handle two-word nouns', () => {
      expect(helpers.slugifyText('treatment record')).to.equal(
        'treatment-record',
      );
      expect(helpers.slugifyText('previous name')).to.equal('previous-name');
      expect(helpers.slugifyText('medical treatment')).to.equal(
        'medical-treatment',
      );
      expect(helpers.slugifyText('dependent child')).to.equal(
        'dependent-child',
      );
    });

    it('should handle long multi-word nouns', () => {
      expect(helpers.slugifyText('federal medical facility')).to.equal(
        'federal-medical-facility',
      );
      expect(helpers.slugifyText('asset previously not reported')).to.equal(
        'asset-previously-not-reported',
      );
    });
  });

  describe('features', () => {
    it('should convert camelCase to kebab-case by default', () => {
      expect(helpers.slugifyText('employerName')).to.equal('employer-name');
      expect(helpers.slugifyText('myVeryLongCamelCaseString')).to.equal(
        'my-very-long-camel-case-string',
      );
    });

    it('should preserve camelCase (just lowercase) when convertCamelCase is false', () => {
      expect(
        helpers.slugifyText('employerName', { convertCamelCase: false }),
      ).to.equal('employername');
      expect(
        helpers.slugifyText('myVeryLongCamelCaseString', {
          convertCamelCase: false,
        }),
      ).to.equal('myverylongcamelcasestring');
    });

    it('should preserve special characters', () => {
      expect(helpers.slugifyText('name (with) parens')).to.equal(
        'name-(with)-parens',
      );
      expect(helpers.slugifyText('test!@#$%^&*()test')).to.equal(
        'test!@#$%^&*()test',
      );
    });

    it('should preserve multiple spaces as multiple dashes', () => {
      expect(helpers.slugifyText('multiple  spaces')).to.equal(
        'multiple--spaces',
      );
      expect(helpers.slugifyText('too---many---dashes')).to.equal(
        'too---many---dashes',
      );
    });

    it('should preserve existing dashes in names or identifiers', () => {
      expect(helpers.slugifyText('mary-anne-3333')).to.equal('mary-anne-3333');
      expect(helpers.slugifyText('jean-luc')).to.equal('jean-luc');
      expect(helpers.slugifyText('SSN-123-45-6789')).to.equal(
        'ssn-123-45-6789',
      );
    });

    it('should handle edge cases', () => {
      expect(helpers.slugifyText('')).to.equal('');
      expect(helpers.slugifyText(null)).to.equal('');
      expect(helpers.slugifyText(undefined)).to.equal('');
      expect(helpers.slugifyText('---')).to.equal('---');
      expect(helpers.slugifyText('test 123 name')).to.equal('test-123-name');
    });
  });
});

describe('getDependsPath', () => {
  it('should return null if pages is null or undefined', () => {
    const result = helpers.getDependsPath(null, {});
    expect(result).to.be.null;

    const result2 = helpers.getDependsPath(undefined, {});
    expect(result2).to.be.null;
  });

  it('should return null if pages is an empty array', () => {
    const result = helpers.getDependsPath([], {});
    expect(result).to.be.null;
  });

  it('should return the path if there is only one page', () => {
    const pages = [{ path: '/single-page' }];
    const result = helpers.getDependsPath(pages, {});
    expect(result).to.eq('/single-page');
  });

  it('should return the first page that matches depends condition', () => {
    const formData = { hasCondition: true };
    const pages = [
      { path: '/page-1', depends: data => data.hasCondition === false },
      { path: '/page-2', depends: data => data.hasCondition === true },
      { path: '/page-3', depends: data => data.something === true },
    ];

    const result = helpers.getDependsPath(pages, formData);
    expect(result).to.eq('/page-2');
  });

  it('should return the first page path if no depends conditions match', () => {
    const formData = { hasCondition: false };
    const pages = [
      { path: '/page-1', depends: data => data.hasCondition === true },
      { path: '/page-2', depends: data => data.something === true },
    ];

    const result = helpers.getDependsPath(pages, formData);
    expect(result).to.eq('/page-1');
  });

  it('should return first matching page when multiple depends conditions are true', () => {
    const formData = { condition1: true, condition2: true };
    const pages = [
      { path: '/page-1', depends: data => data.condition1 === true },
      { path: '/page-2', depends: data => data.condition2 === true },
    ];

    const result = helpers.getDependsPath(pages, formData);
    expect(result).to.eq('/page-1');
  });

  it('should handle complex depends logic', () => {
    const formData = { type: 'veteran', enrolled: true };
    const pages = [
      {
        path: '/civilian-path',
        depends: data => data.type === 'civilian',
      },
      {
        path: '/veteran-enrolled-path',
        depends: data => data.type === 'veteran' && data.enrolled === true,
      },
      {
        path: '/veteran-not-enrolled-path',
        depends: data => data.type === 'veteran' && data.enrolled === false,
      },
    ];

    const result = helpers.getDependsPath(pages, formData);
    expect(result).to.eq('/veteran-enrolled-path');
  });
});

describe('validateIncompleteItems', () => {
  it('should be valid if array is undefined', () => {
    const arrayData = undefined;
    const isItemIncomplete = item => !item?.name;

    const isValid = helpers.validateIncompleteItems({
      arrayData,
      isItemIncomplete,
      arrayPath: 'testArray',
    });

    expect(isValid).to.be.true;
  });

  it('should be valid if the array is empty', () => {
    const arrayData = [];
    const isItemIncomplete = item => !item?.name;

    const isValid = helpers.validateIncompleteItems({
      arrayData,
      isItemIncomplete,
      arrayPath: 'testArray',
    });

    expect(isValid).to.be.true;
  });

  it('should not be valid if the one of the items is invalid', () => {
    const arrayData = [{ name: 'Test' }, { name: '' }];
    const isItemIncomplete = item => !item?.name;

    const isValid = helpers.validateIncompleteItems({
      arrayData,
      isItemIncomplete,
      arrayPath: 'testArray',
    });

    expect(isValid).to.be.false;
  });

  it('should fire an array builder event if invalid index 0', () => {
    const arrayData = [{ name: '' }, { name: 'Test' }];
    const isItemIncomplete = item => !item?.name;
    let eventData;

    const unsubscribe = subscribeToArrayBuilderEvent(
      ARRAY_BUILDER_EVENTS.INCOMPLETE_ITEM_ERROR,
      event => {
        eventData = event;
      },
    );

    // Similar to clicking "continue" on a form page
    navigationState.setNavigationEvent();

    const isValid = helpers.validateIncompleteItems({
      arrayData,
      isItemIncomplete,
      arrayPath: 'testArray',
    });

    expect(isValid).to.be.false;
    expect(eventData).to.deep.eq({
      index: 0,
      arrayPath: 'testArray',
    });

    unsubscribe();
  });

  it('should fire an array builder event if invalid index 1', () => {
    const arrayData = [{ name: 'Test' }, { name: '' }];
    const isItemIncomplete = item => !item?.name;
    let eventData;

    const unsubscribe = subscribeToArrayBuilderEvent(
      ARRAY_BUILDER_EVENTS.INCOMPLETE_ITEM_ERROR,
      event => {
        eventData = event;
      },
    );

    // Similar to clicking "continue" on a form page
    navigationState.setNavigationEvent();

    const isValid = helpers.validateIncompleteItems({
      arrayData,
      isItemIncomplete,
      arrayPath: 'testArray',
    });

    expect(isValid).to.be.false;
    expect(eventData).to.deep.eq({
      index: 1,
      arrayPath: 'testArray',
    });

    unsubscribe();
  });
});
