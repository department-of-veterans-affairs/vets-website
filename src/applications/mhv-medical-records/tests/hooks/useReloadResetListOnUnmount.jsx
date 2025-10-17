import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import useReloadResetListOnUnmount from '../../hooks/useReloadResetListOnUnmount';
import { loadStates } from '../../util/constants';

function TestComponent(props) {
  const { listState, dispatch, updateListStateAction } = props; // eslint-disable-line react/prop-types
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListStateAction,
  });
  return <></>;
}

const renderWith = (override = {}) => {
  const dispatch = sinon.spy();
  const updateListStateAction =
    override.updateListStateAction || (p => ({ type: 'UPDATE', payload: p }));
  const { listState } = override;
  const utils = render(
    <TestComponent
      listState={listState}
      dispatch={dispatch}
      updateListStateAction={updateListStateAction}
    />,
  );
  return { dispatch, updateListStateAction, listState, ...utils };
};

describe('useReloadResetListOnUnmount', () => {
  it('resets FETCHING to PRE_FETCH on unmount', () => {
    const { dispatch, unmount } = renderWith({
      listState: loadStates.FETCHING,
    });
    const pre = dispatch.callCount;
    unmount();
    const delta = dispatch.callCount - pre;
    sinon.assert.match(
      delta,
      1,
      'Expected one dispatch when state was FETCHING at unmount',
    );
    const anyMatch = dispatch.args.some(
      args => args[0] && args[0].payload === loadStates.PRE_FETCH,
    );
    sinon.assert.match(
      anyMatch,
      true,
      `Dispatch did not include PRE_FETCH reset: ${JSON.stringify(
        dispatch.args,
      )}`,
    );
  });

  it('does not dispatch when listState is PRE_FETCH', () => {
    const { dispatch, unmount } = renderWith({
      listState: loadStates.PRE_FETCH,
    });
    const pre = dispatch.callCount;
    unmount();
    sinon.assert.match(dispatch.callCount - pre, 0);
  });

  it('does not dispatch when listState is FETCHED', () => {
    const { dispatch, unmount } = renderWith({
      listState: loadStates.FETCHED,
    });
    const pre = dispatch.callCount;
    unmount();
    sinon.assert.match(dispatch.callCount - pre, 0);
  });

  it('does not reset if state changed from FETCHING to FETCHED before unmount', () => {
    const dispatch = sinon.spy();
    const updateListStateAction = p => ({ type: 'UPDATE', payload: p });
    const { rerender, unmount } = render(
      <TestComponent
        listState={loadStates.FETCHING}
        dispatch={dispatch}
        updateListStateAction={updateListStateAction}
      />,
    );
    // Transition to FETCHED before unmount
    rerender(
      <TestComponent
        listState={loadStates.FETCHED}
        dispatch={dispatch}
        updateListStateAction={updateListStateAction}
      />,
    );
    const pre = dispatch.callCount;
    unmount();
    sinon.assert.match(dispatch.callCount - pre, 0);
  });
});
