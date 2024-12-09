import { omit } from 'lodash';
import { expect } from 'chai';
import {
  getDataToSet,
  getDefaultState,
  getSearchAction,
  getSearchIndex,
} from '../../../../utils/helpers';

describe('hca `getDataToSet` method', () => {
  const listRef = [{ name: 'John' }, { name: 'Jane' }, { name: 'Mary' }];
  const viewFields = {
    report: 'view:reportDependents',
    skip: 'view:skipDependents',
  };
  const getProps = ({ localData = null }) => {
    const searchIndex = 1;
    return {
      slices: {
        beforeIndex: listRef.slice(0, searchIndex),
        afterIndex: listRef.slice(searchIndex + 1),
      },
      dataKey: 'dependents',
      localData,
      viewFields,
      listRef,
    };
  };
  const expectedResults = {
    blank: {
      dependents: listRef,
      [viewFields.report]: null,
      [viewFields.skip]: true,
    },
    populated: {
      dependents: [{ name: 'John' }, { name: 'Liz' }, { name: 'Mary' }],
      [viewFields.report]: null,
      [viewFields.skip]: true,
    },
  };

  it('should return the original dataset with the modified viewfield values when localData is set to `null`', () => {
    const props = getProps({});
    expect(getDataToSet(props)).to.deep.equal(expectedResults.blank);
  });

  it('should return the modified dataset without modifying the viewfield values when localData is populated', () => {
    const props = getProps({ localData: { name: 'Liz' } });
    expect(getDataToSet(props)).to.deep.equal(expectedResults.populated);
  });
});

describe('hca `getDefaultState` method', () => {
  const getProps = ({
    searchAction = { mode: 'add' },
    searchIndex = 0,
    dataToSearch = [],
    defaultData = { data: {}, page: 'basic-info' },
  }) => ({
    name: 'ITEM',
    defaultData,
    dataToSearch,
    searchAction,
    searchIndex,
  });
  const expectedResults = {
    blank: { data: {}, page: 'basic-info' },
    populated: { data: { name: 'Mary' }, page: 'basic-info' },
  };

  it('should gracefully return when the data props are omitted', () => {
    const props = omit(['defaultData', 'dataToSearch'], getProps({}));
    expect(getDefaultState(props)).to.deep.equal({});
  });

  it('should return the default data when there is no data record for the search index', () => {
    const props = getProps({});
    expect(getDefaultState(props)).to.deep.equal(expectedResults.blank);
  });

  it('should return the correct data when there is a data record for the search index', () => {
    const props = getProps({ dataToSearch: [{ name: 'Mary' }] });
    expect(getDefaultState(props)).to.deep.equal(expectedResults.populated);
    expect(window.sessionStorage.getItem(props.name)).to.be.null;
  });

  it('should return the found data record when the search action is set to `edit`', () => {
    const props = getProps({
      dataToSearch: [{ name: 'Mary' }],
      searchAction: { mode: 'edit' },
    });
    expect(getDefaultState(props)).to.deep.equal(expectedResults.populated);
    expect(window.sessionStorage.getItem(props.name)).to.equal(
      props.searchIndex.toString(),
    );
  });
});

describe('hca `getSearchAction` method', () => {
  it('should default to adding a new record when the action is omitted', () => {
    const params = new URLSearchParams('');
    const returnPath = 'summary';
    const expectedResult = {
      mode: 'add',
      label: 'adding',
      pathToGo: `/${returnPath}`,
    };
    expect(getSearchAction(params, returnPath)).to.deep.equal(expectedResult);
  });

  it('should default to adding a new record when the action is set to `add`', () => {
    const params = new URLSearchParams('action=add');
    const returnPath = 'summary';
    const expectedResult = {
      mode: 'add',
      label: 'adding',
      pathToGo: `/${returnPath}`,
    };
    expect(getSearchAction(params, returnPath)).to.deep.equal(expectedResult);
  });

  it('should set the correct props in the response when the action is set to `edit`', () => {
    const params = new URLSearchParams('action=edit');
    const returnPath = 'summary';
    const expectedResult = {
      mode: 'edit',
      label: 'editing',
      pathToGo: `/${returnPath}`,
    };
    expect(getSearchAction(params, returnPath)).to.deep.equal(expectedResult);
  });

  it('should set the correct props in the response when the action is set to `update`', () => {
    const params = new URLSearchParams('action=update');
    const returnPath = 'summary';
    const expectedResult = {
      mode: 'update',
      label: 'editing',
      pathToGo: `/review-and-submit`,
    };
    expect(getSearchAction(params, returnPath)).to.deep.equal(expectedResult);
  });
});

describe('hca `getSearchIndex` method', () => {
  it('should default to `zero` when the array to search is omitted', () => {
    const params = new URLSearchParams('');
    const arrayToParse = undefined;
    expect(getSearchIndex(params, arrayToParse)).to.equal(0);
  });

  it('should default to the end of the array when the index is omitted', () => {
    const params = new URLSearchParams('');
    const arrayToParse = [1, 2];
    expect(getSearchIndex(params, arrayToParse)).to.equal(arrayToParse.length);
  });

  it('should default to the end of the array when the index is not a number', () => {
    const params = new URLSearchParams('index=ddd');
    const arrayToParse = [1, 2];
    expect(getSearchIndex(params, arrayToParse)).to.equal(arrayToParse.length);
  });

  it('should default to the end of the array when the index is greater than the array length', () => {
    const params = new URLSearchParams('index=40');
    const arrayToParse = [1, 2];
    expect(getSearchIndex(params, arrayToParse)).to.equal(arrayToParse.length);
  });

  it('should return the correct index when the index is within the the array length', () => {
    const params = new URLSearchParams('index=1');
    const arrayToParse = [1, 2];
    expect(getSearchIndex(params, arrayToParse)).to.equal(1);
  });
});
