import sinon from 'sinon';
import { expect } from 'chai';
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

describe('minMaxItemsHint', () => {
  let hint = helpers.minMaxItemsHint({
    arrayData: [{}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    minItems: 2,
    maxItems: 5,
  });
  expect(hint).to.eq(
    'You need to add a minimum of 2 and maximum of 5 employers.',
  );

  hint = helpers.minMaxItemsHint({
    arrayData: [],
    nounPlural: 'employers',
    nounSingular: 'employer',
    minItems: 1,
  });
  expect(hint).to.eq('You need to add a minimum of 1 employer.');

  hint = helpers.minMaxItemsHint({
    arrayData: [{}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    minItems: 2,
  });
  expect(hint).to.eq('You need to add a minimum of 2 employers.');

  hint = helpers.minMaxItemsHint({
    arrayData: [],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add up to 5.');

  hint = helpers.minMaxItemsHint({
    arrayData: [{}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add 4 more employers.');

  hint = helpers.minMaxItemsHint({
    arrayData: [{}, {}, {}, {}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add 1 more employer.');

  hint = helpers.minMaxItemsHint({
    arrayData: [{}, {}, {}, {}, {}],
    nounPlural: 'employers',
    nounSingular: 'employer',
    maxItems: 5,
  });
  expect(hint).to.eq('You can add up to 5.');

  hint = helpers.minMaxItemsHint({
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
