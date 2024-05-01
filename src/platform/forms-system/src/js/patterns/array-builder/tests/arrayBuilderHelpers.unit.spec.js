import sinon from 'sinon';
import { expect } from 'chai';
import * as helpers from '../helpers';
import { DEFAULT_ARRAY_BUILDER_TEXT } from '../arrayBuilderText';

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
  });
  Object.keys(DEFAULT_ARRAY_BUILDER_TEXT).forEach(key => {
    if (key === 'getItemName') {
      return;
    }
    expect(getText(key)).to.be.a('string');
  });
  expect(getText).to.be.a('function');
});
