import sinon from 'sinon';
import { updateActiveFormPageContextMiddleware } from 'platform/forms-system/src/js/state/middleware';
import { activeFormPageContextInstance } from 'platform/forms-system/src/js/state/activeFormPageContext';

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

describe('updateActiveFormPageContextMiddleware', () => {
  it('should set activeFormPageContext when UPDATE_ROUTE is dispatched with a location', () => {
    const formState = {
      pages: mockPages,
    };

    const action = {
      type: 'UPDATE_ROUTE',
      location: {
        path: '/mental-health/events-summary',
      },
    };

    const updaterSpy = sinon.spy(activeFormPageContextInstance, 'update');
    updateActiveFormPageContextMiddleware(formState, action);

    sinon.assert.calledOnce(updaterSpy);
    sinon.assert.calledWith(updaterSpy, {
      arrayPath: undefined,
      chapterKey: 'mentalHealth',
      pageKey: 'eventsList',
      index: null,
      pagePath: 'mental-health/events-summary',
    });

    updaterSpy.restore();
  });

  it('should set activeFormPageContext when UPDATE_ROUTE is dispatched with no location', () => {
    const formState = {
      pages: mockPages,
    };

    const action = {
      type: 'UPDATE_ROUTE',
      location: {},
    };

    const updaterSpy = sinon.spy(activeFormPageContextInstance, 'update');
    updateActiveFormPageContextMiddleware(formState, action);

    sinon.assert.calledOnce(updaterSpy);
    sinon.assert.calledWith(updaterSpy, {
      chapterKey: undefined,
      pageKey: undefined,
      arrayPath: undefined,
      index: null,
      pagePath: undefined,
    });

    updaterSpy.restore();
  });

  it('should NOT not set activeFormPageContext for redux events other than UPDATE_ROUTE', () => {
    const formState = {
      pages: mockPages,
    };

    const action = {
      type: 'SET_DATA',
      data: {
        someData: 'someValue',
      },
    };

    const updaterSpy = sinon.spy(activeFormPageContextInstance, 'update');
    updateActiveFormPageContextMiddleware(formState, action);

    sinon.assert.notCalled(updaterSpy);

    updaterSpy.restore();
  });
});
