import { expect } from 'chai';
import { breadcrumbsReducer } from '../../reducers/breadcrumbs';
import { Actions } from '../../util/actionTypes';
import { Breadcrumbs } from '../../util/constants';

describe('Breadcrumbs Reducer', () => {
  const defaultCrumbsList = [
    Breadcrumbs.MY_HEALTH,
    Breadcrumbs.MEDICAL_RECORDS,
  ];

  it('should return initial state', () => {
    const state = breadcrumbsReducer(undefined, {});
    expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
  });

  it('should handle SET_BREAD_CRUMBS with valid crumbs', () => {
    const action = {
      type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      payload: {
        crumbs: [{ href: '/test', label: 'Test', isRouterLink: true }],
      },
    };
    const state = breadcrumbsReducer(undefined, action);
    expect(state.crumbsList).to.have.lengthOf(3);
    expect(state.crumbsList[2].label).to.equal('Test');
  });

  it('should return default crumbs when payload.crumbs is not an array', () => {
    const action = {
      type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      payload: {
        crumbs: 'not an array',
      },
    };
    const state = breadcrumbsReducer(undefined, action);
    expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
  });

  it('should return default crumbs when payload.crumbs is null', () => {
    const action = {
      type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      payload: {
        crumbs: null,
      },
    };
    const state = breadcrumbsReducer(undefined, action);
    expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
  });

  it('should return default crumbs when payload.crumbs is undefined', () => {
    const action = {
      type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      payload: {
        crumbs: undefined,
      },
    };
    const state = breadcrumbsReducer(undefined, action);
    expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
  });

  it('should handle multiple crumbs', () => {
    const action = {
      type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      payload: {
        crumbs: [
          { href: '/test1', label: 'Test 1', isRouterLink: true },
          { href: '/test2', label: 'Test 2', isRouterLink: true },
        ],
      },
    };
    const state = breadcrumbsReducer(undefined, action);
    expect(state.crumbsList).to.have.lengthOf(4);
    expect(state.crumbsList[2].label).to.equal('Test 1');
    expect(state.crumbsList[3].label).to.equal('Test 2');
  });
});

describe('Undefined Access Protection Tests for Breadcrumbs', () => {
  const defaultCrumbsList = [
    Breadcrumbs.MY_HEALTH,
    Breadcrumbs.MEDICAL_RECORDS,
  ];

  describe('breadcrumbsReducer with undefined array access', () => {
    it('should not throw when crumbs array is empty', () => {
      const action = {
        type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
        payload: {
          crumbs: [],
        },
      };
      expect(() => breadcrumbsReducer(undefined, action)).to.not.throw();
      const state = breadcrumbsReducer(undefined, action);
      expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
    });

    it('should not throw when crumbs[0] is undefined', () => {
      const action = {
        type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
        payload: {
          crumbs: [undefined],
        },
      };
      expect(() => breadcrumbsReducer(undefined, action)).to.not.throw();
      const state = breadcrumbsReducer(undefined, action);
      // Should still add the undefined item to the list since isArrayAndHasItems returns true
      expect(state.crumbsList).to.have.lengthOf(3);
    });

    it('should handle crumbs array with null elements', () => {
      const action = {
        type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
        payload: {
          crumbs: [null],
        },
      };
      expect(() => breadcrumbsReducer(undefined, action)).to.not.throw();
      const state = breadcrumbsReducer(undefined, action);
      expect(state.crumbsList).to.have.lengthOf(3);
    });

    it('should handle crumbs array with mix of valid and invalid items', () => {
      const action = {
        type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
        payload: {
          crumbs: [
            undefined,
            { href: '/valid', label: 'Valid', isRouterLink: true },
            null,
          ],
        },
      };
      expect(() => breadcrumbsReducer(undefined, action)).to.not.throw();
      const state = breadcrumbsReducer(undefined, action);
      expect(state.crumbsList).to.have.lengthOf(5);
    });

    it('should handle missing payload gracefully', () => {
      const action = {
        type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
        payload: undefined,
      };
      expect(() => breadcrumbsReducer(undefined, action)).to.not.throw();
      const state = breadcrumbsReducer(undefined, action);
      expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
    });

    it('should handle null payload', () => {
      const action = {
        type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
        payload: null,
      };
      expect(() => breadcrumbsReducer(undefined, action)).to.not.throw();
      const state = breadcrumbsReducer(undefined, action);
      expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
    });

    it('should return default state for unknown action type', () => {
      const action = {
        type: 'UNKNOWN_ACTION',
        payload: {
          crumbs: [{ href: '/test', label: 'Test', isRouterLink: true }],
        },
      };
      const state = breadcrumbsReducer(undefined, action);
      expect(state.crumbsList).to.deep.equal(defaultCrumbsList);
    });
  });
});
