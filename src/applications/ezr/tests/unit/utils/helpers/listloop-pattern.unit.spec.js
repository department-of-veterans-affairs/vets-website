import { expect } from 'chai';
import {
  getDataToSet,
  getSearchAction,
  getSearchIndex,
} from '../../../../utils/helpers/listloop-pattern';

describe('ezr list-loop pattern helpers', () => {
  context('when `getDataToSet` executes', () => {
    const listRef = [{ name: 'John' }, { name: 'Jane' }, { name: 'Mary' }];
    const searchIndex = 1;
    const defaultProps = {
      slices: {
        beforeIndex: listRef.slice(0, searchIndex),
        afterIndex: listRef.slice(searchIndex + 1),
      },
      dataKey: 'dependents',
      localData: { name: 'Liz' },
      listRef,
      viewFields: {
        add: 'view:addDependent',
        skip: 'view:skipDependents',
      },
    };
    const expectedResults = {
      blank: {
        dependents: listRef,
        [defaultProps.viewFields.add]: null,
        [defaultProps.viewFields.skip]: true,
      },
      populated: {
        dependents: [{ name: 'John' }, { name: 'Liz' }, { name: 'Mary' }],
      },
    };

    context('when localData is populated', () => {
      it('should return the modified dataset without modifying the viewfield values', () => {
        expect(JSON.stringify(getDataToSet(defaultProps))).to.equal(
          JSON.stringify(expectedResults.populated),
        );
      });
    });

    context('when localData is set to `null`', () => {
      it('should return the original dataset with the modified viewfield values', () => {
        const props = { ...defaultProps, localData: null };
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
  });
});
