import { expect } from 'chai';
import {
  getDataToSet,
  getSearchAction,
  getSearchIndex,
  getDefaultState,
} from '../../../../utils/helpers/listloop-pattern';

describe('ezr list-loop pattern helpers', () => {
  context('when `getDataToSet` executes', () => {
    const getData = ({
      listRef = [{ name: 'John' }, { name: 'Jane' }, { name: 'Mary' }],
      searchIndex = 1,
      localData = null,
      viewFields = {
        add: 'view:addDependent',
        skip: 'view:skipDependents',
      },
    }) => ({
      props: {
        slices: {
          beforeIndex: listRef.slice(0, searchIndex),
          afterIndex: listRef.slice(searchIndex + 1),
        },
        dataKey: 'dependents',
        localData,
        listRef,
        viewFields,
      },
      expectedResults: {
        blank: {
          dependents: listRef,
          [viewFields.add]: null,
          [viewFields.skip]: true,
        },
        populated: {
          dependents: [{ name: 'John' }, { name: 'Liz' }, { name: 'Mary' }],
          [viewFields.add]: null,
          [viewFields.skip]: true,
        },
      },
    });

    context('when localData is populated', () => {
      it('should return the modified dataset without modifying the viewfield values', () => {
        const { props, expectedResults } = getData({
          localData: { name: 'Liz' },
        });
        expect(JSON.stringify(getDataToSet(props))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
      });
    });

    context('when localData is set to `null`', () => {
      it('should return the original dataset with the modified viewfield values', () => {
        const { props, expectedResults } = getData({});
        expect(JSON.stringify(getDataToSet(props))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });
  });

  context('when `getSearchAction` executes', () => {
    context('when the action is omitted', () => {
      it('should default to adding a new record', () => {
        const params = new URLSearchParams('');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'add',
          label: 'adding',
          pathToGo: `/${returnPath}`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });

    context('when the action is set to `add`', () => {
      it('should default to adding a new record', () => {
        const params = new URLSearchParams('action=add');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'add',
          label: 'adding',
          pathToGo: `/${returnPath}`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });

    context('when the action is set to `edit`', () => {
      it('should set the correct props in the response', () => {
        const params = new URLSearchParams('action=edit');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'edit',
          label: 'editing',
          pathToGo: `/${returnPath}`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });

    context('when the action is set to `update`', () => {
      it('should set the correct props in the response', () => {
        const params = new URLSearchParams('action=update');
        const returnPath = 'summary';
        const expectedResult = {
          mode: 'update',
          label: 'editing',
          pathToGo: `/review-and-submit`,
        };
        expect(JSON.stringify(getSearchAction(params, returnPath))).to.equal(
          JSON.stringify(expectedResult),
        );
      });
    });
  });

  context('when `getSearchIndex` executes', () => {
    context('when the index is omitted', () => {
      it('should default to the end of the array', () => {
        const params = new URLSearchParams('');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(
          arrayToParse.length,
        );
      });
    });

    context('when the index is not a number', () => {
      it('should default to the end of the array', () => {
        const params = new URLSearchParams('index=ddd');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(
          arrayToParse.length,
        );
      });
    });

    context('when the index is greater than the array length', () => {
      it('should default to the end of the array', () => {
        const params = new URLSearchParams('index=40');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(
          arrayToParse.length,
        );
      });
    });

    context('when the index is within the the array length', () => {
      it('should return the correct index', () => {
        const params = new URLSearchParams('index=1');
        const arrayToParse = [1, 2];
        expect(getSearchIndex(params, arrayToParse)).to.equal(1);
      });
    });

    context('when the array is omitted', () => {
      it('should default to the the start of a new array', () => {
        const params = new URLSearchParams('index=0');
        expect(getSearchIndex(params)).to.equal(0);
      });
    });
  });

  context('when `getDefaultState` executes', () => {
    const getData = ({
      searchIndex = 0,
      searchAction = { mode: 'add' },
      defaultData = { data: {}, page: 'basic-info' },
      dataToSearch = [],
      name = 'ITEM',
    }) => ({
      props: {
        searchIndex,
        searchAction,
        defaultData,
        dataToSearch,
        name,
      },
      expectedResults: {
        blank: defaultData,
        populated: { data: { name: 'Mary' }, page: 'basic-info' },
      },
    });

    context('when `searchIndex` is null', () => {
      it('should return the default data', () => {
        const { props, expectedResults } = getData({ searchIndex: null });
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });

    context('when `dataToSearch` is omitted', () => {
      it('should return the default data', () => {
        const { props, expectedResults } = getData({});
        delete props.dataToSearch;
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });

    context('when there is no data record for the search index', () => {
      it('should return the default data', () => {
        const { props, expectedResults } = getData({});
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.blank),
        );
      });
    });

    context('when there is a data record for the search index', () => {
      it('should return the found data record', () => {
        const { props, expectedResults } = getData({
          dataToSearch: [{ name: 'Mary' }],
        });
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
        expect(window.sessionStorage.getItem(props.name)).to.be.null;
      });
    });

    context('when the search action is set to `edit`', () => {
      it('should return the found data record', () => {
        const { props, expectedResults } = getData({
          dataToSearch: [{ name: 'Mary' }],
          searchAction: { mode: 'edit' },
        });
        expect(JSON.stringify(getDefaultState(props))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
        expect(window.sessionStorage.getItem(props.name)).to.equal(
          props.searchIndex.toString(),
        );
      });
    });
  });
});
