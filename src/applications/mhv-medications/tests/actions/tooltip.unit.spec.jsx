import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockApiRequest,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { Actions } from '../../util/actionTypes';
import {
  getTooltips,
  createNewTooltip,
  incrementTooltip,
  updateTooltipVisibility,
  setTooltip,
  getTooltip,
} from '../../actions/tooltip';
import { tooltipNames } from '../../util/constants';

const createActionTrackingStore = (initialState = {}) => {
  const recordedActions = [];

  const recordActionsMiddleware = () => next => action => {
    if (typeof action !== 'function') {
      recordedActions.push(action);
    }
    return next(action);
  };

  const store = createStore(
    state => state,
    initialState,
    applyMiddleware(thunk, recordActionsMiddleware),
  );

  return {
    ...store,
    getActions: () => recordedActions,
    clearActions: () => {
      recordedActions.length = 0;
    },
  };
};

describe('mhv-medications tooltip actions', () => {
  const mockStore = (initialState = {}) =>
    createActionTrackingStore(initialState);

  afterEach(() => {
    resetFetch();
  });

  it('dispatches GET_TOOLTIPS on getTooltips success', async () => {
    const response = [{ id: '1', tooltipName: 'foo' }];
    mockApiRequest(response);

    const store = mockStore();
    const result = await store.dispatch(getTooltips());

    expect(result).to.deep.equal(response);
    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.GET_TOOLTIPS,
        response,
      },
    ]);
  });

  it('dispatches GET_TOOLTIPS_ERROR on getTooltips failure', async () => {
    mockApiRequest({ errors: [{ title: 'error' }] }, false);

    const store = mockStore();
    const result = await store.dispatch(getTooltips());

    expect(result).to.be.an('object');
    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.GET_TOOLTIPS_ERROR,
      },
    ]);
  });

  it('dispatches CREATE_TOOLTIP on createNewTooltip success', async () => {
    const response = { data: { id: '1' } };
    mockApiRequest(response);

    const store = mockStore();
    const result = await store.dispatch(createNewTooltip());

    expect(result).to.deep.equal(response);
    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.CREATE_TOOLTIP,
        response,
      },
    ]);
  });

  it('dispatches CREATE_TOOLTIP_ERROR on createNewTooltip failure', async () => {
    mockApiRequest({ errors: [{ title: 'error' }] }, false);

    const store = mockStore();
    const result = await store.dispatch(createNewTooltip());

    expect(result).to.be.an('object');
    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.CREATE_TOOLTIP_ERROR,
      },
    ]);
  });

  it('does not dispatch additional actions when incrementTooltip succeeds', async () => {
    mockApiRequest({});

    const store = mockStore();
    await store.dispatch(incrementTooltip('123'));

    expect(global.fetch.calledOnce).to.be.true;
    expect(store.getActions()).to.be.empty;
  });

  it('dispatches INCREMENT_TOOLTIP_COUNTER_ERROR on incrementTooltip failure', async () => {
    const error = new Error('increment failed');
    sinon.stub(global, 'fetch').rejects(error);

    const store = mockStore();
    await store.dispatch(incrementTooltip('123'));

    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
        error,
      },
    ]);
  });

  it('dispatches SET_TOOLTIP_VISIBILITY on updateTooltipVisibility success', async () => {
    mockApiRequest({});

    const store = mockStore();
    const visibility = { isVisible: false };
    await store.dispatch(updateTooltipVisibility('123', visibility));

    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
        payload: visibility,
      },
    ]);
  });

  it('dispatches UPDATE_TOOLTIP_VISIBILITY_ERROR on updateTooltipVisibility failure', async () => {
    mockApiRequest({ errors: [{ title: 'error' }] }, false);

    const store = mockStore();
    await store.dispatch(updateTooltipVisibility('123', { isVisible: true }));

    const actions = store.getActions();
    expect(actions).to.have.lengthOf(1);
    expect(actions[0].type).to.equal(
      Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
    );
    expect(actions[0].error).to.exist;
  });

  it('dispatches SET_TOOLTIP_ID and SET_TOOLTIP_VISIBILITY on setTooltip', () => {
    const store = mockStore();
    store.dispatch(setTooltip('tooltip-id', true));

    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.SET_TOOLTIP_ID,
        payload: 'tooltip-id',
      },
      {
        type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
        payload: true,
      },
    ]);
  });

  it('returns the medications tooltip from getTooltip', async () => {
    const response = [
      { tooltipName: 'other-tooltip', id: 1 },
      {
        tooltipName: tooltipNames.mhvMedicationsTooltipFilterAccordion,
        id: 2,
      },
    ];
    mockApiRequest(response);

    const store = mockStore();
    const result = await store.dispatch(getTooltip());

    expect(result).to.deep.equal(response[1]);
    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.GET_TOOLTIPS,
        response,
      },
    ]);
  });

  it('returns undefined when tooltip is not found in getTooltip', async () => {
    const response = [{ tooltipName: 'another-tooltip', id: 1 }];
    mockApiRequest(response);

    const store = mockStore();
    const result = await store.dispatch(getTooltip());

    expect(result).to.be.undefined;
    expect(store.getActions()).to.deep.equal([
      {
        type: Actions.Tooltip.GET_TOOLTIPS,
        response,
      },
    ]);
  });

  it('dispatches GET_TOOLTIP_ERROR when getTooltip encounters an exception', async () => {
    const error = new Error('dispatch failed');
    const dispatch = sinon.stub();
    dispatch.onFirstCall().rejects(error);
    dispatch.onSecondCall().returns();

    const result = await getTooltip()(dispatch);

    expect(result).to.equal(error);
    expect(
      dispatch.secondCall.calledWith({
        type: Actions.Tooltip.GET_TOOLTIP_ERROR,
        error,
      }),
    ).to.be.true;
  });
});
