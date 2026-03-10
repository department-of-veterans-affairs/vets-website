import { expect } from 'chai';
import { tooltipReducer } from '../../reducers/tooltip';
import { Actions } from '../../util/actionTypes';

describe('tooltipReducer', () => {
  const initialState = {
    tooltipVisible: false,
    tooltipId: undefined,
    error: undefined,
  };

  it('returns initial state by default', () => {
    const state = tooltipReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).to.deep.equal(initialState);
  });

  it('handles SET_TOOLTIP_ID', () => {
    const state = tooltipReducer(initialState, {
      type: Actions.Tooltip.SET_TOOLTIP_ID,
      payload: 'tooltip-123',
    });
    expect(state.tooltipId).to.equal('tooltip-123');
    expect(state.error).to.be.null;
  });

  it('handles SET_TOOLTIP_VISIBILITY to true', () => {
    const state = tooltipReducer(initialState, {
      type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
      payload: true,
    });
    expect(state.tooltipVisible).to.be.true;
    expect(state.error).to.be.null;
  });

  it('handles SET_TOOLTIP_VISIBILITY to false', () => {
    const prevState = { ...initialState, tooltipVisible: true };
    const state = tooltipReducer(prevState, {
      type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
      payload: false,
    });
    expect(state.tooltipVisible).to.be.false;
    expect(state.error).to.be.null;
  });

  it('clears error when SET_TOOLTIP_ID is dispatched', () => {
    const prevState = { ...initialState, error: 'some error' };
    const state = tooltipReducer(prevState, {
      type: Actions.Tooltip.SET_TOOLTIP_ID,
      payload: 'tooltip-456',
    });
    expect(state.error).to.be.null;
  });

  it('clears error when SET_TOOLTIP_VISIBILITY is dispatched', () => {
    const prevState = { ...initialState, error: 'some error' };
    const state = tooltipReducer(prevState, {
      type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
      payload: true,
    });
    expect(state.error).to.be.null;
  });

  it('handles INCREMENT_TOOLTIP_COUNTER_ERROR', () => {
    const error = { message: 'increment failed' };
    const state = tooltipReducer(initialState, {
      type: Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
      error,
    });
    expect(state.error).to.deep.equal(error);
  });

  it('handles UPDATE_TOOLTIP_VISIBILITY_ERROR', () => {
    const error = { message: 'update visibility failed' };
    const state = tooltipReducer(initialState, {
      type: Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
      error,
    });
    expect(state.error).to.deep.equal(error);
  });

  it('preserves other state fields on error', () => {
    const prevState = {
      tooltipVisible: true,
      tooltipId: 'tooltip-789',
      error: undefined,
    };
    const error = { message: 'something broke' };
    const state = tooltipReducer(prevState, {
      type: Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
      error,
    });
    expect(state.tooltipVisible).to.be.true;
    expect(state.tooltipId).to.equal('tooltip-789');
    expect(state.error).to.deep.equal(error);
  });
});
