import {
  activeFormPageContextInstance,
  resetActiveFormPageContext,
  updateActiveFormPageContext,
} from 'platform/forms-system/src/js/state/activeFormPageContext';
import sinon from 'sinon';

const mockReduxFormPages = {
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

describe('activeFormPageContext', () => {
  it('should be able to reset activeFormPageContext', () => {
    const update = sinon.spy(activeFormPageContextInstance, 'update');
    resetActiveFormPageContext();
    sinon.assert.calledOnce(update);
    sinon.assert.calledWith(update, {
      arrayPath: null,
      chapterKey: null,
      pageKey: null,
      pagePath: null,
      index: null,
    });
    update.restore();
  });

  it('should be able to update activeFormPageContext via a pages object', () => {
    const update = sinon.spy(activeFormPageContextInstance, 'update');
    let urlPath = '/mental-health/0/events-details';
    updateActiveFormPageContext(mockReduxFormPages, urlPath);
    sinon.assert.calledOnce(update);
    sinon.assert.calledWithMatch(update, {
      arrayPath: 'events',
      chapterKey: 'mentalHealth',
      pageKey: 'eventsDetails',
      index: 0,
      pagePath: 'mental-health/:index/events-details',
    });

    urlPath = '/mental-health/events-summary';
    updateActiveFormPageContext(mockReduxFormPages, urlPath);
    sinon.assert.calledTwice(update);
    sinon.assert.calledWithMatch(update, {
      arrayPath: undefined,
      chapterKey: 'mentalHealth',
      pageKey: 'eventsList',
      index: null,
      pagePath: 'mental-health/events-summary',
    });

    resetActiveFormPageContext();
    sinon.assert.calledThrice(update);
    sinon.assert.calledWithMatch(update, {
      arrayPath: null,
      chapterKey: null,
      pageKey: null,
      pagePath: null,
      index: null,
    });

    update.restore();
  });
});
