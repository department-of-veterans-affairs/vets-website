import sinon from 'sinon';
import { expect } from 'chai';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import {
  subscribeToArrayBuilderEvent,
  ARRAY_BUILDER_EVENTS,
} from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderEvents';
import { DEFAULT_ARRAY_BUILDER_TEXT } from '../arrayBuilderText';
import * as helpers from '../helpers';

describe('arrayBuilder helpers', () => {
  it('onNavBackRemoveAddingItem returned to intro if items are 0', () => {
    const goPath = sinon.spy();
    const setFormData = sinon.spy();
    helpers.onNavBackRemoveAddingItem({
      arrayPath: 'employers',
      summaryRoute: '/summary',
      introRoute: '/intro',
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
      summaryRoute: '/summary',
      introRoute: '/intro',
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
      summaryRoute: '/summary',
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
      summaryRoute: '/summary',
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
      summaryRoute: '/summary',
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
      urlParams: {
        edit: true,
      },
    });

    expect(goPreviousPath.calledWith({ edit: true })).to.be.true;
  });

  it('onNavBackKeepUrlParams with add true', () => {
    const goPreviousPath = sinon.spy();
    helpers.onNavBackKeepUrlParams({
      goPreviousPath,
      urlParams: {
        add: true,
      },
    });

    expect(goPreviousPath.calledWith({ add: true })).to.be.true;
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
      nounSingular: 'employer',
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
    Object.keys(DEFAULT_ARRAY_BUILDER_TEXT).forEach(key => {
      if (key === 'getItemName') {
        return;
      }
      expect(getText(key)).to.be.a('string');
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
    expect(updatedItem.nounSingular).to.eq(null);
    expect(updatedItem.index).to.eq(null);
  });

  it('should return expected values for an item', () => {
    const updatedItem = helpers.getUpdatedItemFromPath('?updated=employer-0');
    expect(updatedItem.nounSingular).to.eq('employer');
    expect(updatedItem.index).to.eq(0);
  });

  it('should return expected values for an item', () => {
    const updatedItem = helpers.getUpdatedItemFromPath(
      '?updated=treatment-records-2',
    );
    expect(updatedItem.nounSingular).to.eq('treatment records');
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
  it('should return a slugified version of the noun singular', () => {
    let text = 'Treatment records';
    let slugified = helpers.slugifyText(text);
    expect(slugified).to.equal('treatment-records');

    text = 'employer';
    slugified = helpers.slugifyText(text);
    expect(slugified).to.equal('employer');

    text = 'traumatic event';
    slugified = helpers.slugifyText(text);
    expect(slugified).to.equal('traumatic-event');
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
