import { applyActiveContextMiddleware } from 'platform/forms-system/src/js/state/middleware';
import { expect } from 'chai';

const mockPages = {
  veteranInformation: {
    chapterKey: 'veteranInformation',
    editMode: false,
    pageKey: 'veteranInformation',
    path: 'veteran-information',
    schema: {},
    uiSchema: {},
  },
  eventsList: {
    chapterKey: 'mentalHealth',
    CustomPage: {},
    editMode: false,
    pageKey: 'eventsList',
    path: 'mental-health/events-summary',
    schema: {},
    uiSchema: {},
  },
  eventsDetails: {
    arrayPath: 'events',
    chapterKey: 'mentalHealth',
    editMode: [],
    pageKey: 'eventsDetails',
    path: 'mental-health/:index/events-details',
    schema: {},
    showPagePerItem: true,
    uiSchema: {},
  },
};

describe('applyActiveContextMiddleware', () => {
  it('should set activeContext when UPDATE_ROUTE is dispatched with a location', () => {
    const formState = {
      pages: mockPages,
    };

    const action = {
      type: 'UPDATE_ROUTE',
      location: {
        path: '/mental-health/events-summary',
      },
    };

    const nextAction = applyActiveContextMiddleware(formState, action);
    expect(nextAction).to.deep.equal({
      type: 'SET_ACTIVE_CONTEXT',
      activeContext: {
        chapterKey: 'mentalHealth',
        pageKey: 'eventsList',
        arrayPath: undefined,
        index: undefined,
        pagePath: 'mental-health/events-summary',
      },
    });
  });

  it('should set activeContext when UPDATE_ROUTE is dispatched with no location', () => {
    const formState = {
      pages: mockPages,
    };

    const action = {
      type: 'UPDATE_ROUTE',
      location: {},
    };

    const nextAction = applyActiveContextMiddleware(formState, action);
    expect(nextAction).to.deep.equal({
      type: 'SET_ACTIVE_CONTEXT',
      activeContext: {
        chapterKey: undefined,
        pageKey: undefined,
        arrayPath: undefined,
        index: undefined,
        pagePath: '',
      },
    });
  });

  it('should NOT set activeContext for redux events other than UPDATE_ROUTE', () => {
    const formState = {
      pages: mockPages,
    };

    const action = {
      type: 'SET_DATA',
      data: {
        someData: 'someValue',
      },
    };

    const nextAction = applyActiveContextMiddleware(formState, action);
    // no change should be made to the action
    expect(nextAction).to.equal(action);
  });
});
